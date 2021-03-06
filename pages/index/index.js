var network = require("../../utils/network.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
import bus from '../../utils/bus.js'

let storage = require("../../utils/storage");
import {CONFIG} from "../../utils/config";

Page({
    data: {
        timetables: [],
        userInfo: {},
        cardCur: 0,
        openLocationState: true,
        swiperList: [
            {
                id: 0,
                type: 'image',
                url: 'https://s2.ax1x.com/2019/09/04/nEdjAg.th.jpg'
            }, {
                id: 1,
                type: 'image',
                url: 'https://s2.ax1x.com/2019/09/04/nEwn3R.th.jpg',
            }, {
                id: 2,
                type: 'image',
                url: 'https://s2.ax1x.com/2019/09/04/nEwUgI.th.jpg'
            }],
        iconList: [
            {
                icon: 'newsfill',
                color: 'red',
                badge: 0,
                name: '课表',
                url: '/pages/index/timetable/timetable'
            }, {
                icon: 'activityfill',
                color: 'orange',
                badge: 0,
                name: '考试',
                url: '/pages/index/exam/exam'
            }, {
                icon: 'medalfill',
                color: 'yellow',
                badge: 0,
                name: '成绩',
                url: '/pages/index/grade/grade'
            }, {
                icon: 'skinfill',
                color: 'olive',
                badge: 0,
                name: '拼车',
                //url拼车
                url: '/pages/index/pinche/pinche'
            }],
        gridCol: 4,
        skin: false,
        recommend: [],
        location: false,
        markers: [],
    },
    getSwiperList() {
        let that = this;
        network.getBanner({
            success: (res) => {
                console.log(res)
                that.setData({
                    swiperList: res.data
                })
                console.log(res)
            },
            fail: (res) => {
                console.log(res)
            }
        })
    },
    bannerClick(e) {
        // console.log(e.currentTarget.dataset.url)
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    },
    // toAct:function(){
    //   wx.navigateTo({
    //     url: '/pages/mine/activity/activity',
    //   })
    // },
    nav: function(e){
        console.info(e);
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        });
    },

    attent(e) {
        let id = e.detail.target.id;
        console.log(id)
        let formId = e.detail.formId
        console.log(e);
        let index = e.detail.target.dataset.index;
        wx.showLoading({
            title: '关注中....',
        });
        // pers 关注
        network.attentOthers({
            id: id,
            formId: formId,
            success: (res) => {
                wx.hideLoading();
                let recommend = this.data.recommend;
                recommend[index].focus = true;
                this.setData({
                    recommend: recommend
                })
            },
            fail: (res) => {
                console.log(res)
            }
        })
    },
    unAttent(e) {
        wx.showLoading({
            title: '取关中....',
        });
        let id = e.detail.target.id;
        console.info(e);

        let index = e.detail.target.dataset.index;
        // pers 关注
        network.cancelAttentOthers({
            id: id,
            success: (res) => {
                wx.hideLoading();
                let recommend = this.data.recommend;
                recommend[index].focus = false;
                this.setData({
                    recommend: recommend
                })
            },
            fail: (res) => {
                console.log(res)
            }
        })
    },

    onLoad() {

        network.getOpenSchool({
            success: res => {
                console.info(res);
                let currWeek = res.data.week + 1;
                storage.put("currWeek", currWeek, 24 * 60 * 60);
                storage.put("openDate", res.data.openDate, 24 * 60 * 60);
                storage.put("version", res.data.version);


                if (res.data.version === CONFIG.VERSION){
                    wx.setTabBarItem({
                        index: 1,
                        text: '课表',
                        iconPath: '/images/icon/shipin.png',
                        selectedIconPath: '/images/icon/shipin.png',
                    });
                }


                // wx.setStorageSync("currWeek", currWeek);
                // wx.setStorageSync("openDate", res.data.openDate);
                console.info("当前周数" + currWeek);
                this.towerSwiper('swiperList');
                // 初始化towerSwiper 传已有的数组名即可
                let timetable = storage.get("timetable", null) || null;
                let timetables = [];
                let today = (new Date()).getDay();
                if (!timetable) {
                    network.getTimeTable({
                        success: res => {
                            res.data.forEach(item => {
                                if (today === item.day) {
                                    item.week_list.forEach(week => {
                                        if (week === currWeek) {
                                            timetables.push(item);
                                        }
                                    })
                                }
                            });
                        },
                        fail: res => {

                        }
                    });
                } else {
                    timetable.forEach(item => {
                        if (today === item.day) {
                            item.week_list.forEach(week => {
                                if (week === currWeek) {
                                    timetables.push(item);
                                }
                            })
                        }
                    });
                }

                this.setData({
                    timetables: timetables
                })
            }
        })


        //获取推荐的人
        network.getRecommend({
            success: (res) => {
                let recommend = res.data.data;
                recommend.forEach(item => {
                    item.focus = false;
                });
                this.setData({
                    recommend: recommend
                })
                console.log(this.data.recommend)

            },
            fail: (res) => {
                console.log(res)
            }
        })
    },
    clickUser(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/mine/user/info?id=' + e.currentTarget.dataset.user.id,
        })
    },
    markertap: function (e) {
        console.info(e);
        wx.navigateTo({
            url: '/pages/mine/user/info?id=' + e.markerId,
        })
    },
    // towerSwiper
    // 初始化towerSwiper
    towerSwiper(name) {
        let list = this.data[name];
        for (let i = 0; i < list.length; i++) {
            list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
            list[i].mLeft = i - parseInt(list.length / 2)
        }
        this.setData({
            swiperList: list
        })
    },
    // towerSwiper触摸开始
    towerStart(e) {
        this.setData({
            towerStart: e.touches[0].pageX
        })
    },
    // towerSwiper计算方向
    towerMove(e) {
        this.setData({
            direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
        })
    },
    // towerSwiper计算滚动
    towerEnd(e) {
        let direction = this.data.direction;
        let list = this.data.swiperList;
        if (direction == 'right') {
            let mLeft = list[0].mLeft;
            let zIndex = list[0].zIndex;
            for (let i = 1; i < list.length; i++) {
                list[i - 1].mLeft = list[i].mLeft
                list[i - 1].zIndex = list[i].zIndex
            }
            list[list.length - 1].mLeft = mLeft;
            list[list.length - 1].zIndex = zIndex;
            this.setData({
                swiperList: list
            })
        } else {
            let mLeft = list[list.length - 1].mLeft;
            let zIndex = list[list.length - 1].zIndex;
            for (let i = list.length - 1; i > 0; i--) {
                list[i].mLeft = list[i - 1].mLeft
                list[i].zIndex = list[i - 1].zIndex
            }
            list[0].mLeft = mLeft;
            list[0].zIndex = zIndex;
            this.setData({
                swiperList: list
            })
        }
    },
    onShow() {

        getApp().updateBadge();
        let that = this;
        this.getSwiperList();
        this.setData({
            userInfo: wx.getStorageSync("userInfo")
        });


        wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
                this.setData({
                    location: true
                })
            },
            fail: (res) => {
                this.setData({
                    location: false
                })
                wx.showToast({
                    title: '请开启定位',
                    icon: 'none'
                })
            }
        })
    },
    openMap: function (e) {
        console.log(this.data.location)
        var that = this
        wx.getSetting({
            success(res) {
                console.log(1)
                //这里判断是否有地位权限
                if (!res.authSetting['scope.userLocation']) {
                    wx.openSetting({
                        success: (res) => {
                            that.setData({
                                location: true
                            })
                        }
                    })
                }
            }

        })
    },
    onShareAppMessage() {
        return {
            title: '转发',
            path: '/pages/index/index',
            success: function (res) {
            }
        }
    }
})

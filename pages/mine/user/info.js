// pages/mine/user/info.js
var network = require('../../../utils/network.js')
import dynamic from '../../../modules/dynamic/dynamic.js';

var doommList = [];
let page = null;

class Doomm {
    constructor(text, top, time, color) {
        this.text = text;
        this.top = top;
        this.time = time;
        this.color = color;
        this.display = true;
    }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //用户信息
        nickname: '',
        profile: '',
        major: '',
        avatar: '',
        stuId: "",
        grade: "",
        love: "单身",
        userId: "",
        follower: false,
        //问题列表
        questions: [],
        randomOpacity: [],
        random: Math.floor(Math.random() * 5),
        opacity: [0.28, 0.33, 0.35, 0.75, 0.86, 0.9, 0.8],
        randomColorArr: [],
        //颜色 标签云
        colorArr: ["#EE2C2C", "#ff7070", "#EEC900", "#4876FF", "#ff6100",
            "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
            "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
            "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
            "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"
        ],
        //标签
        labArr: [],
        //页面切换
        index: 0,
        scroll_left: 'scroll_left',
        scroll_right: 'scroll_right',
        checked: 'checked bg-green',
        unchecked: '',
        ranIndex: Math.floor(Math.random() * 5),
        dynamics: [],
        doommData: []
    },
    back: function (e) {
        wx.navigateBack({});
    },

    tapchange: function (e) {
        console.log(e);
        this.setData({
            index: e.target.dataset.id
        });
        console.log(this.data.index)
    },
    focus: function (e) {
        let formId = e.detail.formId;
        network.addFormId({formId});
        network.attentOthers({
            id: this.data.userId,
            success: res => {
                this.setData({
                    follower: true
                })
            }
        })
    },
    cancelFocus: function (e) {
        console.log(e);
        let formId = e.detail.formId;
        network.addFormId({formId});
        network.cancelAttentOthers({
            id: this.data.userId,
            success: res => {
                this.setData({
                    follower: false
                })
            }
        })
    },
    sendMsg: function (e) {
        wx.navigateTo({
            url: "/pages/chat/chat?userId=" + this.data.userId
        })
    },

    clickContent(e) {
        dynamic.clickContent(e);
    },
    clickAvatar: function (e) {
        dynamic.clickAvatar(e);
    },
    clickImages: function (e) {
        dynamic.clickImages(e);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        if (options.id === getApp().globalData.userInfo.id) {
            wx.switchTab({
                url: "/pages/mine/index"
            });
        }
        wx.showLoading({
            title: '加载中....',
        });
        console.info(options);
        let that = this;
        //获取别人的信息
        network.getOtherInfo({
            userId: options.id,
            success: function (res) {
                wx.hideLoading();
                console.log('获取成功');
                let interest = res.data.interest;
                let loveTmp = "单身";
                if (res.data.love === 2) {
                    loveTmp = "恋爱中";
                } else if (res.data.love === 3) {
                    loveTmp = "保密";
                }
                that.setData({
                    labArr: interest,
                    avatar: res.data.avatar,
                    nickname: res.data.nickname,
                    profile: res.data.profile,
                    major: res.data.major,
                    stuId: res.data.stuId,
                    grade: res.data.grade,
                    gender: res.data.gender,
                    follower: res.data.focus,
                    userId: res.data.id,
                    love: loveTmp,
                    fans: res.data.followerNum,
                    focus: res.data.focusNum,
                    dynamicNum: res.data.dynamicNum
                })
                doommList = []

                interest.forEach(item => {
                    doommList.push(new Doomm(item, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10 + 3)));
                    that.setData({
                        doommData: doommList
                    });
                })


                // 获取相关数据
                network.getOtherDynamic({
                    userId: options.id, success: res => {

                        res.data.data.forEach(item => {
                            item.nickname = item.user.nickname,
                                item.avatar = item.user.avatar,
                                item.commentNum = item.comments.length,
                                item.good = item.liker.length,
                                item.createTime = item.createTime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                        });
                        console.info(res.data.data);
                        that.setData({
                            dynamics: res.data.data
                        });
                    }
                });


            },
            fail: function () {
                console.log('获取失败');
            }
        })
        console.log(options);

        // //获取别人的问题
        // network.getOtherQuestion({
        //   userId: options.id,
        //   success: function(res) {
        //     console.log('获取问题成功');
        //     let questions = res.data.questions
        //     that.setData({
        //       questions:questions
        //     })
        //   },
        //   fail: function() {
        //     console.log('获取问题失败');
        //   }
        // })


    }

})

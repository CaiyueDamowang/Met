const app = getApp();
let utils = require('../../utils/util.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('userInfo', e.detail.userInfo);

      let userInfo = {
        nickname: e.detail.userInfo.nickName,
        profile:'这个人很懒',
        birthday:'2018-12-12 12:12:12',
        age:18,
        avatar: e.detail.userInfo.avatarUrl
      };
      utils.req('user', userInfo, function(res){console.info(res)});
      utils.getReq('user', {}, function(res){
        console.info(res.data.stuId);
        wx.setStorageSync("userInfo", res.data);
        if(!res.data.stuId){
          console.info("data");
          wx.redirectTo({
            url: '/pages/mine/jwxt/jwxt',
          });
        }else{
          // app.getIMHandler().updateUserInfo(res.data);

          wx.switchTab({
            url: '/pages/dynamic/list/list',
          });

        }
      });


    }
  },
  skip:function(e){
    console.info("点击跳过 很有可能获取不了头像");
    getApp().globalData.skip = true;
    console.info(getApp().globalData);
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
});

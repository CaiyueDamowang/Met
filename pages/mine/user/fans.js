// pages/mine/user/fans.js
import dynamic from '../../../modules/dynamic/dynamic.js'
const network = require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log('fans onload')
    wx.showLoading({
      title: '加载中....',
    })
    network.getUserFollower({
      success:(res)=>{
        wx.hideLoading();
        let users = res.data;
        this.setData({
          fans: res.data || []
        })
      },
      fail:(res)=> consolelog(res)
    })
  },
  clickUser(e) {
    dynamic.clickAvatar(e);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
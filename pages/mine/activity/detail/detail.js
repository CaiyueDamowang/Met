// pages/mine/activity/detail/detail.js
var network = require("../../../../utils/network.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail:{
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    console.log(options.id)
    network.getDetailAct({
      id:options.id,
      success:(res)=>{
        console.log(res)
        this.setData({
          detail:res.data
        })
      }
    })
  },
  join:function(){
    network.signUpAct({
      id:this.data.detail.id,
      success:()=>{
        wx.showToast({
          title: '报名成功',
        })
      }
    })
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
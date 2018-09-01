// pages/publication/bodycopy/bodycopy.js
var WebIM = require('../../../utils/WebIM.js')
var WebIM = WebIM.default
// import { Base64 } from '../../../utils/wxBase64/base64.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    shareData: {
      // title : '',
      // path: '',
      // imageUrl: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('publication bodycopy ' + options.chapter)
    
    let theShareData = {}
    theShareData.title = '我們就是這樣一群人'
    theShareData.desc = '感恩随喜分享功德'
    theShareData.chapter = options.chapter
    // theShareData.chapter= Base64.encode(options.chapter)
    
    this.setData({
      text: options.chapter,
      shareData: theShareData
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
  // onShareAppMessage: function (options) {
  //   console.log('source:' + options.from + ' ' + options.target)
  //   return this.data.shareData
  // }
})
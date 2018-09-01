// pages/common/register/register.js
var strophe = require('../../../utils/strophe.js')
var WebIM = require('../../../utils/WebIM.js')
var WebIM = WebIM.default
const app = getApp();
const { getSessionId } = require('../../../ajax/_api.js');
const { obj2str } = require('../../../ajax/_ultra.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dispname: '',
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(WebIM.config.apiURL)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  bindDispname: function(e) {
    this.setData({
      dispname: e.detail.value
    })

  },
  bindUsername: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  bindPassword: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  register: function() {
    var that = this
    if (that.data.dispname == '') {
      wx.showModal({
        title: '請輸入姓名！',
        confirmText: 'OK',
        showCancel: false
      })
    } else if (that.data.username == '') {
      wx.showModal({
        title: '請輸入帳號！',
        confirmText: 'OK',
        showCancel: false
      })
    } else if (that.data.password == '') {
      wx.showModal({
        title: '請輸入密碼！',
        confirmText: 'OK',
        showCancel: false
      })
    } else {
      var sessionId = getSessionId()
      var options = {
        apiUrl: WebIM.config.apiURL,
        sessionid: sessionId,
        dispname: that.data.dispname,
        username: that.data.username,
        password: that.data.password,        
        appKey: WebIM.config.appkey,
        success: function(res) {
          console.log('check point: ' + (res.state == 0))
          if (res.state == 0) {
            console.log('data:' + obj2str(res))
            if(res.state == 0){
              wx.showModal({
                title: '注册成功 ' + res.name,
                // content: '这是一个模态弹窗',
                confirmColor: '#1e88e5',
                success: function (e) {
                  if (e.confirm) {
                    console.log('用户点击确定')
                    // console.log('$$$ready to navigate back...')
                    wx.navigateBack({
                      delta: 2
                    });
                  } else if (e.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }else{
              wx.showModal({
                title: '用户註冊失敗2',
                content: res.errmsg,
                showCancel: false,
                confirmText: 'OK'
              })              
            }
          }
        },
        error: function(res) {
          console.log('check point: ' + (res.data != null))
          if (res.data != null) {
            wx.showModal({
              title: '用户註冊失敗',
              content: obj2str(res.data),
              showCancel: false,
              confirmText: 'OK'
            })
            
          }else{
            wx.showModal({
              title: '用户註冊失敗1',
              showCancel: false,
              confirmText: 'OK'
            })
          }
        }
      }
      WebIM.utils.registerUser(options)
    }

  }

})
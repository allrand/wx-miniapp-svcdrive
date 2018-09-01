// pages/common/login/login.js
const util = require('../../../ajax/_ultra.js');
const {
  obj2str
} = require('../../../ajax/_ultra.js');
const {
  getSessionId
} = require('../../../ajax/_api.js');
var WebIM = require('../../../utils/WebIM.js')
var WebIM = WebIM.default
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnUrl: '',
    username: '',
    password: '',
    active: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('---onLoad: ' + obj2str(options))
    if (options.returnUrl) {
      this.setData({
        returnUrl: options.returnUrl,
      });
    }
  },

  focus(e) {
    this.setData({
      active: e.currentTarget.dataset.name
    })
  },
  blur(e) {
    this.setData({
      active: ''
    })
  },
  validate(event) {
    this.setData({
      [event.currentTarget.dataset.name]: util.trim(event.detail.value)
    })
    // console.log(this.data)
  },

  loginSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', this.data)
    const page = this;
    if (e.currentTarget.dataset.disabled === 'true') return false;
    if (this.data.username === '') {
      wx.showModal({
        title: '登录失败',
        content: '用户名不能为空，请输入用户名',
        showCancel: false,
        confirmColor: '#1e88e5',
      })
      return false;
    }
    if (this.data.password === '') {
      wx.showModal({
        title: '登录失败',
        content: '密码不能为空，请输入密码',
        showCancel: false,
        confirmColor: '#1e88e5',
      })
      return false;
    }

    // app.loginAndGetAccountInfo(e.detail.value).then(function(res) {
    //     console.log('--- data: ' + obj2str(res))
    //     wx.showModal({
    //       title: '登录成功',
    //       content: res.name,
    //       showCancel: false,
    //       success: function(res) {
    //         if (res.confirm) {
    //           console.log('用户点击确定')

    //           wx.redirectTo({
    //             url: '../../index/index'
    //           })
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //         }
    //       }
    //     })

    //   },
    //   function(error) {
    //     console.error('$$$exception: ', error);
    //   }
    // );
    var sessionId = getSessionId()
    var options = {
      apiUrl: WebIM.config.apiURL,
      sessionid: sessionId,
      username: e.detail.value.username,
      password: e.detail.value.password,
      appKey: WebIM.config.appkey,
      success: function(resp) {
        console.log(obj2str(resp))
        wx.showModal({
          title: '登录成功',
          content: resp.name,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')

              wx.redirectTo({
                url: '../../index/index'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      error: function(res) {
        // console.log('error check point: ' + (res.statusCode == 200))
        // if (res.statusCode == 200) {
        if (res.data) {
          if (res.data.state != 0) {
            wx.showModal({
              title: '登陸失敗！！！',
              content: res.data.errmsg,
              showCancel: false,
              confirmText: 'OK'
            })
          }
        } else {
          wx.showModal({
            title: '登陸失敗！！',
            content: 'statusCode: ' + res.statusCode + ' errMsg: ' + res.errMsg,
            showCancel: false,
            confirmText: 'OK'
          })
        }
      }
    }
    WebIM.utils.login(options)
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
})
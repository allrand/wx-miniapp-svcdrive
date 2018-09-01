// pages/dock/dock.js
const { obj2str } = require('../../ajax/_ultra.js');
const { getSessionId } = require('../../ajax/_api.js');
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginUrl: '../common/login/login',
    returnUrl: '',
    details: [],
    curIndex: 0,
    latestDOA: ['', ''],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  refreshDockData: function (options){
    var that = this
    var sessionId = getSessionId()
    var options = {
      apiUrl: WebIM.config.apiURL,
      sessionid: sessionId,
      appKey: WebIM.config.appkey,
      success: function (res) {
        console.log('success check point: ' + (res.state == 0))
        if (res.state == 0) {
          console.log('res:' + obj2str(res))
          if (res.state == 0) {
            console.log('dock length: ' + (res.dockinfo.length))
            //modify the dock for UI
            for (var i = 0; i < res.dockinfo.length; i++) {
              for (var j = 0; j < res.dockinfo[i].dock.length; j++) {
                console.log(res.dockinfo[i].dock[j].doa)
                var doas = res.dockinfo[i].dock[j].doa.split('=')
                if (doas.length == 2) {
                  var period = doas[0].split('-')
                  if (period.length == 2)
                    doas[0] = period
                  res.dockinfo[i].dock[j].doas = doas
                }

              }
            }
            that.setData({
              details: res.dockinfo,
            });
          } else {
            wx.showModal({
              title: '獲取進度信息失敗2',
              content: res.errmsg,
              showCancel: false,
              confirmText: 'OK'
            })
          }
        }
      },
      error: function (res) {
        console.log('error check point: ' + (res.statusCode))
        if (res.statusCode > 299) {
          wx.showModal({
            title: '獲取進度信息失敗2',
            content: res.data.message,
            showCancel: false,
            confirmText: 'OK',
            success: function (res) {
              if (res.confirm) {
                console.log('$$$ready to redirect: ' + that.data.loginUrl)
                wx.navigateTo({
                  url: that.data.loginUrl,
                });

              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateBack({
                  delta: 2
                })
              }
            }
          })
          
        } else {
          wx.showModal({
            title: '獲取進度信息失敗21',
            content: obj2str(res),
            showCancel: false,
            confirmText: 'OK'
          })
        }
      }
    }
    WebIM.utils.getUserDock(options)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('dock onLoad...' + obj2str(options))
    if (options.returnUrl) {
      this.setData({
        returnUrl: options.returnUrl,
      });
    }

    // refreshDockData()
    that.refreshDockData()
    
  },

  bindSwiperChange(e) {
    console.log('bindSwiperChange current: ' + e.detail.current)
    this.setData({
      curIndex: e.detail.current,
      // latestDOA: ''
    })

  },

  bindDoaValue: function (e) {    
    var that = this
    var i = that.data.curIndex
    console.log('bindDoaValue current: ' + e.detail.value + ' ' + i )
    that.data.latestDOA[i] = e.detail.value

  },

  doaSubmit(e) {
    console.log('doaSubmit->curIndex: ' + this.data.curIndex + ' ')
    var that = this
    var i = that.data.curIndex
    var lstDOA = this.data.latestDOA[i]
    if (lstDOA == '') {
      wx.showModal({
        title: '請輸入最新進展信息！',
        confirmText: 'OK',
        showCancel: false
      })
    }else{
      var sessionId = getSessionId()
      var bookISBN = this.data.details[this.data.curIndex].barcode
      var options = {
        apiUrl: WebIM.config.apiURL,
        sessionid: sessionId,
        bookisbn: bookISBN,
        latestdoa: lstDOA,
        appKey: WebIM.config.appkey,
        success: function (res) {
          console.log('success doaSubmit: ' + (res.state == 0))
          if (res.state == 0) {
            console.log('res:' + obj2str(res))
            if (res.state == 0) {
              console.log('dock length: ' + (res.dockinfo.length))
              wx.showModal({
                title: '更新進度信息成功',
                // content: res.dockinfo,
                showCancel: false,
                confirmText: 'OK',
                success: function (e) {
                  if (e.confirm) {
                    console.log('用户点击确定')
                    // refreshDockData()
                    that.refreshDockData()

                  } 
                }
              })
            } else {
              wx.showModal({
                title: '更新進度信息失敗',
                content: res.errmsg,
                showCancel: false,
                confirmText: 'OK'
              })
            }
          }
        },
        error: function (res) {
          console.log('error doaSubmit: ' + (res.statusCode == 200))
          if (res.statusCode == 200) {
            if(res.data.state == 401){
              console.error('没有授权信息')
              wx.showModal({
                title: '更新進度信息失敗2',
                content: '請按確定鍵轉到登陸界面',
                showCancel: true,
                confirmText: 'OK',
                success: function (e) {
                  if (e.confirm) {
                    console.log('用户点击确定')
                    // console.log('$$$ready to navigate back...')
                    console.log('$$$ready to redirect: ' + that.data.loginUrl)
                    wx.navigateTo({
                      url: that.data.loginUrl,
                    });
                  } else if (e.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }else{
              wx.showModal({
                title: '更新進度信息失敗2',
                content: res.data.errmsg,
                showCancel: false,
                confirmText: 'OK'
              })
            }
            

          } else {
            wx.showModal({
              title: '更新進度信息失敗3',
              content: obj2str(res),
              showCancel: false,
              confirmText: 'OK'
            })
          }
        }
      }
      WebIM.utils.updateUserDock(options)
    }
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
  // onShareAppMessage: function () {
  
  // }
})
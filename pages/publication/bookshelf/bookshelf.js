// pages/bookshelf.js
const sdriveUrl = require('../../../config').sdriveurl
const { getSessionId } = require('../../../ajax/_api.js');
const { obj2str } = require('../../../ajax/_ultra.js');
const { cmptStr2Array } = require('../../../ajax/_ultra.js');
var WebIM = require('../../../utils/WebIM.js')
var WebIM = WebIM.default

Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnUrl: '',
    loginUrl: '../../../pages/common/login/login',
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 0, //可以控制动画
    list: '',
    detail: [
      {
        id: 1,
        title: '文集',
        list: [                   
          // {
          //   name: '',
          //   subtitle: '',
          //   description: '',
          //   lang: '',
          //   picUrl: '',
          //   showUrl: '../content/content/?id=1.8'
          // },          
        ],
      },

      {
        id: 2,
        title: '其他',
        list: [         

        ],
      },
      
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this    
    console.log('bookshelf onLoad...' + obj2str(options))
    if (options.returnUrl){
      this.setData({
        returnUrl: options.returnUrl,
      });
    }
    
    var sessionId = getSessionId()
    var options = {
      apiUrl: WebIM.config.apiURL,
      sessionid: sessionId,
      appKey: WebIM.config.appkey,
      success: function (resp) {
        console.log('success check point: ' + (resp.state == 0))
        if (resp.state == 0) {
          for (var i = 0; i < resp.books.length; i++) {
            let book = resp.books[i];
            that.data.detail[0].list.push(book)
          }
          that.setData({
            detail: that.data.detail
          })
        } else {
          //show the error info
          wx.showModal({
            title: '授權失败',
            content: '請首先登陸！',
            showCancel: true,
            confirmColor: '#1e88e5',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
                console.log('$$$ready to navigateTo: ' + that.data.loginUrl)
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
        }
      },
      error: function (res) {
        console.log('error check statusCode: ' + (res.statusCode))
        if (res.statusCode > 299) {
          console.log("------- rearch failled with: " + res.data.message)
          wx.showModal({
            title: '授權失败',
            content: '' + res.data.message,
            showCancel: true,
            confirmColor: '#1e88e5',
            success: function (res) {
              wx.navigateBack({
                delta: 2
              })
            }
          });

        } else {
          console.log('error check ' + res.data.errmsg)
          wx.showModal({
            title: '獲取信息失敗',
            content: res.data.errmsg,
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
          // if (res.errMsg) {
            
            
          // }else{
          //   wx.showModal({
          //     title: '獲取進度信息失敗21',
          //     showCancel: false,
          //     confirmText: 'OK'
          //   })
          // }
        }
        
      }
    }
    WebIM.utils.getBooks(options)

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
    // console.log("bookshelf on show...")  
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // }


  //事件处理函数
  bindViewTap: function (e) {
    var that = this
    // console.info('bookshelf bindViewTap: ' + e.target.dataset.src)
    var str = e.target.dataset.src;
    var strs = cmptStr2Array(str)
   
    wx.navigateTo({
      url: '../content/content?' + obj2str(that.data.detail[strs.indexSize].list[strs.index])
    })
  },

  change(e) {
    this.setData({
      indexSize: e.detail.current
    })
  },

  scrollTo(e) {
    this.setData({
      indexSize: e.target.dataset.index
    })
  },

})
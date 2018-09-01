//index.js
const app = getApp()
const sdriveUrl = require('../../config').sdriveurl
const { obj2str } = require('../../ajax/_ultra.js');
const { getSessionId } = require('../../ajax/_api.js');
// import { Base64 } from '../../utils/wxBase64/base64.min.js'
Page({
  data: {
    dispName: '',
    returnUrl: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},

    shareData: {
      title: '加入我們就是這樣一群人',
      desc: '随喜',
      path: '/pages/index/index'
    },
    navData: [
      {
        id: 0,
        name: "精進看書",
        current: 0,
        style: 0,
        ico: 'icon-qiugouguanli',
        fn: 'gotoBookShelf'
      },
      {
        id: 1,
        name: "報進度📅",
        current: 0,
        style: 1,
        ico: '',
        fn: 'gotoDock'
      },
      {
        id: 2,
        name: "云秘記📒",
        current: 0,
        style: 0,
        ico: 'icon-mingpianjia',
        fn: 'gotoJournal'
      },
    ],

  },
  
  onLoad: function () {
    console.log('index onLoad...')
    // console.log( Base64.encode('youngjuning'))  // eW91bmdqdW5pbmc=
    if (app.globalData.wxUserInfo) {
      this.setData({
        userInfo: app.globalData.wxUserInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.info('index onLoad => getUserInfo callback: ' + obj2str( res.userInfo))
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          app.globalData.wxUserInfo = res.userInfo

          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    console.log('index ---> code:' + app.globalData.code)
    app.getWxUserInfo().then(function (res) {
      console.log('index ---> ' + obj2str(res));
    }, function (error) {
      console.error('index ---> oh something bad happened: ', error);
    }
    );
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    console.debug('index onReady...')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {    
    const page = this;

    if (app.globalData.code) {
      let interval = new Date().getTime() - app.globalData.lastUpt;
      if (interval < 5 * 60 * 1000) {
        console.log(" ---> interval is less then 5\"");
        return ;
      }
    }
    //dispName
    if (app.globalData.sdriveInfo != null)
    {
      if (app.globalData.sdriveInfo.name != null){
        page.setData({
          dispName: app.globalData.sdriveInfo.name
        })
      } else if (page.data.hasUserInfo){//
        page.setData({
          dispName: page.data.userInfo.nickName
        })
      }      
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('index onShareAppMessage...')
    return this.data.shareData
  },

  /**
   * User defined functions
   */
  gotoBookShelf: function (e) {
    let that = this
    let navdata = this.data.navData
    wx.navigateTo({
      url: '../publication/bookshelf/bookshelf'

    })
  },
  gotoDock: function (e) {
    console.info(obj2str(e))
    let that = this
    wx.navigateTo({
      url: '../dock/dock'
    })
  },

  gotoJournal: function (e) {
    wx.showModal({
      title: '正在開發中！',
      confirmText: 'OK',
      showCancel: false
    })
  },


  getUserInfo: function (e) {
    console.log('index getUserInfo: ' + obj2str (e.detail.userInfo) )
    
    var res = e.detail.userInfo
    var jscode = ''
    if (e.detail.userInfo) {
      app.globalData.wxUserInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,

      })
      console.log('**rawData  :' + e.detail.rawData)
      console.log('**encrypted:' + e.detail.encryptedData)
      console.log('**       iv:' + e.detail.iv)
      console.log('**signature:' + e.detail.signature)
      wx.request({
        url: sdriveUrl + '/wechat/user/info',
        data: {
          rawData: e.detail.rawData,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          signature: e.detail.signature,
          sessionId: getSessionId(),
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log("signin success with resp: " + obj2str(res) )
        },
        fail: function (res) {
          console.log("signin failled with resp: " + obj2str(res))               
        }

      })
    } else {
      console.error('-------> getUserInfo return error...')
    }
  },

  clearUserInfo: function (e) {
    console.log('clearUserInfo ' + e)
    app.globalData.wxUserInfo = {}
    app.globalData.hasUserInfo = false
    this.setData({
      userInfo: {},
      hasUserInfo: false,
    })
  },
  

})

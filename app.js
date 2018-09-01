//app.js
const openIdUrl = require('./config').openIdUrl
const appId = require('./config').appid
const appSecret = require('./config').secret
const sdriveUrl = require('./config').sdriveurl

const { setSessionId } = require('ajax/_api.js');
const { getSessionId } = require('ajax/_api.js');
// const { openSession } = require('ajax/_api.js');
const { obj2str } = require('./ajax/_ultra.js');
var WebIM = require('utils/WebIM.js')
var WebIM = WebIM.default
App({

  globalData: {
    sdriveInfo: {},  //verified

    wxUserInfo: null,
    lastUpt: null,

    hasLogin: false,
    code: 0,


    //***Credential encryptedData
    rawData: null,
    signature: null,
    encryptedData: null,
    iv: null,
  },

  onLaunch: function () {
    var self = this
    console.info('***app onLaunch...')
    setSessionId('')
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.info('***app getUserInfo success!')
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.wxUserInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: resp => {
              console.warn('***app => request getUserInfo failed!')
            }
          })
        } else {
          console.warn('***app => System does not auth userInfo...')
        }
      },
      fail: res => {
        console.error('***app => fail to getSetting for current user')
      }
    })

  },



  // loginAndGetAccountInfo(formData) {
  //   const app = this;

  //   var sessionId = getSessionId()
  //   console.log('---sessionId: ' + sessionId)

  //   if (sessionId)
  //     formData.sessionId = getSessionId()
  //   else {
  //     return reject({
  //       errorCode: 400,
  //       errorMessage: 'login without sessionid',
  //     });
  //   }
  //   return new Promise(function (resolve, reject) {
  //     dologin.myAccountLogin(formData).then(function (data) {
        
  //       const { accountid, name, errmsg, state, user_mod } = data || {};
  //       if (state === 7) {
  //         wx.showModal({
  //           title: '登陆失败',
  //           content: '账号或密码不正确',
  //           success: () => reject(),
  //         })
  //       } else if (state !== 0 || !accountid) {
  //         wx.showModal({
  //           title: '登录失败',
  //           content: '返回状态码是 ' + state,
  //           success: () => reject(),
  //         });
  //       } else {
  //         app.globalData.sdriveInfo = data
  //         resolve(data)

  //       }
  //     }, function (res) {
  //       wx.showModal({
  //         title: '登录失败',
  //         content: res && res.errorMessage,
  //         success: () => reject(),
  //       });
  //     });
  //   });
  // },

  getWxUserInfo() {
    var app = this;

    return new Promise(function (resolve, reject) {
      // console.log('lastUpt: ' + wx.getStorageInfo('lastUpt'))
      if (app.globalData.code != 0) {
        console.log('***app.getWxUserInfo=> skip to return...')
        return resolve(app.globalData.wxUserInfo);
      }

      wx.login({
        success: res => {
          console.log(obj2str(res))
          if (res.code.length > 1) {
            app.globalData.code = res.code         
            wx.setStorageSync('lastUpt', new Date().getTime())
            var jscode = res.code

            var options = {
              apiUrl: WebIM.config.apiURL,
              jscode: res.code,              
              appKey: WebIM.config.appkey,
              success: function (resp) {
                console.log(obj2str(resp))
                setSessionId(resp.sessionid)

                wx.showToast({
                  title: '連結服務器成功',
                  icon: 'success',
                  duration:2000
                })
              },
              error: function (res) {
                console.log('error data: ' + res.data)
                if (res.data) {
                  if (res.data.state != 0) {
                    wx.showModal({
                      title: '連結服務器失敗！！！',
                      // content: res.data,
                      showCancel: false,
                      confirmText: 'OK'
                    })
                  }
                } else {
                  wx.showModal({
                    title: '連結服務器失敗！！',
                    content: 'statusCode: ' + res.statusCode + ' errMsg: ' + res.errMsg,
                    showCancel: false,
                    confirmText: 'OK'
                  })
                }
              }
            }
            WebIM.utils.openSession(options)

          }
          wx.getUserInfo({
            success: function (res) {
              console.log('***app.getWxUserInfo=> wx getUserInfo: ' + obj2str(res.userInfo))
              app.globalData.wxUserInfo = res.userInfo;
              resolve(app.globalData.wxUserInfo);
            },
            fail: function (res) {
              console.info('***app.getWxUserInfo=> wx getUserInfo failed:' + res.errMsg)
              reject(res);
            }
          });
        },
        fail(res) {
          console.log('***app.getWxUserInfo=> wx login failed: ' + res)
          reject();
        }
      })
    });
  },

  // lazy loading openid
  getUserOpenId: function (callback) {
    var self = this
    console.log('app getUserOpenId... ' + self.globalData.openid)

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function (data) {
          console.log('getUserOpenId request data: ' + data.code)
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success: function (res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function (res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }
})
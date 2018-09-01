// pages/content/content.js
const sdriveUrl = require('../../../config').sdriveurl
const { obj2str } = require('../../../ajax/_ultra.js')
const { getSessionId } = require('../../../ajax/_api.js');
var WebIM = require('../../../utils/WebIM.js')
var WebIM = WebIM.default
Page({
  data: {
    loginUrl: '../../../pages/common/login/login',
    index: 0,
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 0, //可以控制动画
    title: "",
    description: "",
    pic_url: "",
    ingredients: "",

    isbn: "",
    foreword: "",
    authors: "",
    publisher: "",
    lang: "",
    chapterList: "",
    // contentId:"",
    detail: [],
    shareData: {
      title: '我們就是這樣一群人',
      desc: '感恩随喜分享功德',
      path: '/pages/common/share/share'
    }
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this
    that.setData({
      title: options.name
    })

    let bcdata = options;
    that.setData({
      isbn: bcdata.isbn,
      description: bcdata.description,
      foreword: bcdata.foreword,
      authors: bcdata.authors,
      publisher: bcdata.publisher,
      lang: bcdata.lang,
      chapterList: bcdata.chapterList,
      pic_url: bcdata.picUrl
    })
    console.info(obj2str(bcdata))
    if (bcdata.chapterList == ''){
      console.warn('book chapterList is null! ')
      wx.showModal({
        title: '获取信息失败',
        content: '本书的章节信息为空，敬请期待',
        showCancel: false,
        confirmColor: '#1e88e5',
      })
      return
    }

    let cldata = JSON.parse(bcdata.chapterList)
    for (var i = 0; i < cldata.length; i++) {
      if (cldata[i].length) {
        let cptlist = cldata[i];
        // console.log(cptlist)
        for (var j = 0; j < cptlist.length; j++) {
          if (cptlist[j].length) {
            let childlist = cptlist[j]
            // console.log(childlist)
            for (var z = 0; z < childlist.length; z++) {
              // console.log('childlist ' + childlist[z])
              let sample2 = {
                id: "",
                name: "",
                chapter: "",
                lev: ""
              }
              sample2.lev = 2
              sample2.id = childlist[z]
              that.data.detail.push(sample2)
            }

          } else {
            // console.log('cptlist ' + cptlist[j])
            let sample = {
              id: "",
              name: "",
              chapter: "",
              lev: ""
            }
            sample.lev = 1
            sample.id = cptlist[j]
            that.data.detail.push(sample)
          }
        }

      } else {
        console.error('empty chapterList')
      }
    }
    that.setData({
      detail: that.data.detail
    })

    //fetch the content name
    // wx.request({
    //   url: sdriveUrl + '/nousunde/sdrive-app/0A6368617074657273?sessionId=' + getSessionId() + '&bookISBN=' + bcdata.isbn,
    //   // data: {
    //   //   sessionId: getSessionId(),
    //   //   bookISBN: bcdata.isbn
    //   // },
    //   method: 'POST',
    //   success: function (resp) {
    //     console.log(obj2str(resp))
    //     if (200 <= resp.statusCode && resp.statusCode < 300)
    //     {
    //       // console.log('chapters: ' + obj2str(resp.data.chapters) )
    //       if (resp.data.chapters.length > 0) {
    //         for (var i = 0; i < resp.data.chapters.length; i++) {
    //           let cpt = resp.data.chapters[i]
    //           // console.info('{} {} {}', cpt.chapterId, cpt.chapterName, cpt.chapter)
    //           for (var j = 0; j < that.data.detail.length; j++) {
    //             let thatdetail = that.data.detail[j]
    //             if (thatdetail.id == cpt.chapterId) {
    //               thatdetail.name = cpt.chapterName
    //               thatdetail.chapter = cpt.chapter
    //               continue
    //             }
    //           }
    //         }
    //       }
    //       //show the 
    //       that.setData({
    //         detail: that.data.detail,
    //         index: that.data.detail.length
    //       })
    //     }

    //   },
    //   fail: function (resp) {
    //     console.log("content onLoad chapterlist failled: " + resp.data)
    //   }
    // })

    var sessionId = getSessionId()
    var options = {
      apiUrl: WebIM.config.apiURL,
      sessionid: sessionId,
      bookisbn: bcdata.isbn,
      appKey: WebIM.config.appkey,
      success: function (resp) {
        // console.log('check point: ' + (resp.state == 0))
        console.log(obj2str(resp))
        // if (200 <= resp.statusCode && resp.statusCode < 300)
        // {
        // console.log('chapters: ' + obj2str(resp.data.chapters) )
        if (resp.chapters.length > 0) {
          for (var i = 0; i < resp.chapters.length; i++) {
            let cpt = resp.chapters[i]
            // console.info('{} {} {}', cpt.chapterId, cpt.chapterName, cpt.chapter)
            for (var j = 0; j < that.data.detail.length; j++) {
              let thatdetail = that.data.detail[j]
              if (thatdetail.id == cpt.chapterId) {
                thatdetail.name = cpt.chapterName
                thatdetail.chapter = cpt.chapter
                continue
              }
            }
          }
        }
        //show the 
        that.setData({
          detail: that.data.detail,
          index: that.data.detail.length
        })
        // }
      },
      error: function (res) {
        console.log("content onLoad chapterlist failled: " + obj2str(res.data) )
        // console.log('error check point: ' + (res.statusCode == 200))
        // if (res.statusCode == 200) {
          if(res.data.state != 0){
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
                    delta: 1
                  })
                }
              }
            })
          }

        // } else {

        // }
      }
    }
    WebIM.utils.getchapters(options)
  },

  getBodyCopyDetail: function () {
    var menuId = getApp().globalData.selectedMenuId
    var thiz = this
    // wx.request({
    //   url: 'https://apicloud.mob.com/v1/cook/menu/query',
    //   data: {
    //     key: '520520test',
    //     id: menuId
    //   },
    //   method: 'GET',
    //   success: function (res) {
    //     // success
    //     if (res != null) {
    //       var cookDetail = res.data.result
    //       wx.setNavigationBarTitle({
    //         title: cookDetail.name,
    //         success: function (res) {
    //           // success
    //         }
    //       })
    //       console.log(cookDetail)
    //       thiz.setData({
    //         title: cookDetail.name,
    //         description: cookDetail.recipe.description,
    //         image: cookDetail.recipe.img,
    //         ingredients: cookDetail.recipe.ingredients
    //       })
    //     }
    //   },
    //   fail: function () {
    //     // fail
    //     console.error('get cook detail error!')
    //   },
    //   complete: function () {
    //     // complete
    //   }
    // })
  },
  // /**
  //    * 用户点击右上角分享
  //    */
  // onShareAppMessage: function () {
  //   return this.data.shareData
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("content on show...")


  }
})
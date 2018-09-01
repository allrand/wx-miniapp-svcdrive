const sdriveUrl = require('../../config').sdriveurl
const app = getApp()
Page({
  data: {
    result: ''
  },
  onLoad: function () {
    console.log('scanCode onLoad...')
  },

  scanCode: function () {
    var that = this
    that.setData({
      result: ''
    })
    wx.scanCode({
      success: function (res) {
        console.log('scanCode scanType------------------------- ' + res.scanType)
        console.log('scanCode scanPath------------------------- ' + res.path)
        console.log('scanCode result------------------------- ' + res.result)


        wx.request({
          //url: 'http://127.0.0.1:8086/sdrive/nouapp/search/' + res.result,
          url: sdriveUrl + '/sdrive/nouapp/searchx?GoodsId=' + res.result + '&GIdType=' + res.scanType,
          method: 'GET',
          success: function (resp) {
            console.log("success? ------- " + resp.data.success + " -------")
            if(resp.data.success){
              console.log("goods ------- " + resp.data.goods)              
              if (resp.data.goods.goodsName != null){
                console.log("goodsName:" + resp.data.goods.goodsName)
                console.log(resp.data.goods.description);
                that.setData({
                  result: resp.data.goods.goodsName + '\n' + resp.data.goods.description
                })                
              }else{
                that.setData({
                  result: resp.data.goods
                })
              }
              console.log("bookcontent ------- " + resp.data.bookcontent)              
              if (resp.data.bookcontent != null) {                
                that.setData({
                  result: resp.data.goods + '\n' + resp.data.bookcontent
                })
                let bcdata = JSON.parse(resp.data.bookcontent);
                console.log('=======' + bcdata == undefined)
                if(bcdata.status == 0){
                  console.log("chapterList: " + bcdata.chapterList)
                }

              }else{                
                console.log('=======')
                
              }
            }else{
              console.log(resp.data.errmsg)
              if (resp.data.errmsg != null){
                that.setData({
                  result: resp.data.errmsg
                })
              }
              
            }

            
          },
          fail: function (res) {
            console.log("------- rearch failled with resp: " + res.data.errmsg)
            that.setData({
              result: res.data.errmsg
            })
          }
        })
        
      },
      fail: function (res) {
        console.log('scanCode fail-------------------------')
        // 9787504737045  'EAN_13'
        that.searchxByIdAndType('9787504737045', 'EAN_13')
      }
    })
  },

  searchxByIdAndType: function (scanResult, scanType) {
    var that = this
    wx.request({

      url: sdriveUrl + '/sdrive/nouapp/searchx?GoodsId=' + scanResult + '&GIdType=' + scanType,
      method: 'GET',
      success: function (resp) {
        console.log("success? ------- " + resp.data.success + " -------")
        if (resp.data.success) {
          console.log("goods ------- " + resp.data.goods)
          if (resp.data.goods.goodsName != null) {
            console.log("goodsName:" + resp.data.goods.goodsName)
            console.log(resp.data.goods.description);
            that.setData({
              result: resp.data.goods.goodsName + '\n' + resp.data.goods.description
            })
          } else {
            that.setData({
              result: resp.data.goods
            })
          }
          console.log("bookcontent ------- " + resp.data.bookcontent)
          if (resp.data.bookcontent != null) {
            that.setData({
              result: resp.data.goods + '\n' + resp.data.bookcontent
            })
            let bcdata = JSON.parse(resp.data.bookcontent);
            console.log("chapterList: " + bcdata.chapterList)
            let cldata = JSON.parse(bcdata.chapterList)
            // console.log('=======' + cldata.cnt)
            for(var i = 0; i< cldata.length; i++){
              if(cldata[i].length){                
                let cptlist = cldata[i];
                console.log(cptlist)
                for (var j = 0; j < cptlist.length; j++){                  
                  if (cptlist[j].length){
                    let childlist = cptlist[j]
                    console.log(childlist)
                    for (var z = 0; z < childlist.length; z++) {
                      console.log('childlist ' + childlist[z])
                    }

                  }else{
                    console.log('cptlist ' + cptlist[j])
                  }
                  
                }
              }else{
                console.error('empty chapterList')
              }
            }

          } else {
            console.log('======= bookcontent is null')

          }
        } else {
          console.log(resp.data.errmsg)
          if (resp.data.errmsg != null) {
            that.setData({
              result: resp.data.errmsg
            })
          }
        }
      },

      fail: function (res) {
        if (res.errMsg){
          console.log("------- rearch failled with: " + res.errMsg)
          that.setData({
            result: res.errMsg
          })
          if (res.data){
            console.log("------- rearch failled with resp: " + res.data.errmsg)
            that.setData({
              result: res.data.errmsg
            })
          }
          
        }else{
          console.error('------- rearch failled with empty response!')
        }
        
      }
    })
  }
})

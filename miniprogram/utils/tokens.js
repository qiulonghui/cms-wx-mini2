import {
  config
} from '../config.js'

function getTokenFromServer(callBack) {
  var that = this;
  wx.login({
    success: function(res) {
      wx.request({
        url: config.api_base_url + 'api/wx/getToken',
        method: 'get',
        data: {
          code: res.code
        },
        success: function(res) {
          if(res.data.code){
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
            return 
          }
          wx.setStorageSync('access_token', 'Bearer ' + res.data.access_token);
          wx.setStorageSync('refresh_token', 'Bearer ' + res.data.refresh_token);

          callBack && callBack();
        }
      })
    }
  })
}

function refreshTokenFromServer(callBack) {
  const refresh_token =  wx.getStorageSync('refresh_token')

  wx.request({
    url: config.api_base_url + 'cms/user/refresh',
    method: 'get',
    header: {
      'content-type': 'application/json',
      Authorization: refresh_token
    },
    success: function (res) {
      console.log(res)
      const statusCode = res.statusCode.toString()
      if (statusCode.charAt(0) === '2') {
        wx.setStorageSync('access_token', 'Bearer ' + res.data.access_token);
        callBack && callBack(res.data.token);
      }else{
        const code = res.data.code
        if(code === 10100) {
          //刷新令牌获取失败
          getTokenFromServer(callBack)
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  })
}

export {
  getTokenFromServer,
  refreshTokenFromServer
}
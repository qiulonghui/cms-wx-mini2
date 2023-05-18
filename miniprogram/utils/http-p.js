import {
  config
} from '../config.js'

import {
  getTokenFromServer,
  refreshTokenFromServer
} from './tokens.js'


function refreshTokenException(code) {
  const codes = [10000,10100, 10042, 10050, 10052, 10012, 10013]
  return codes.includes(code)
}

// # 解构
class HTTP {
  request({
    url,
    data = {},
    method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }
  // 2小时
  // token1 1小时59分59秒 超过2小时
  // 退出 
  // 自动 无感知帮助他重新刷新令牌
  // 退出 短时间 二次重发机制
  _request(url, resolve, reject, data = {}, method = 'GET', noRefetch = false) {
    const access_token = wx.getStorageSync('access_token')
    wx.request({
      url: config.api_base_url + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        Authorization: access_token
      },
      success: (res) => {
        const statusCode = res.statusCode.toString()
        if (statusCode.charAt(0) === '2') {
          resolve(res.data)
        } else {
          console.log(res)
          const code = res.data.code
          console.log(code)

          if (code === 10041 || code === 10051) {
            // accessToken过期刷新token
            if (!noRefetch) {
              this._refetch(
                url,
                resolve,
                reject,
                data,
                method
              )
            }
          } else if (refreshTokenException(code)) {
            // refreshToken过期重新获取token及refreshToken
            getTokenFromServer(() => {
              this._request(
                url,
                resolve,
                reject,
                data,
                method,
                true
              );
            })
          } else {
            let tipMessage = ''
            const msg = res.data.message
            if (typeof msg === 'string') {
              tipMessage = msg
            }
            if (Object.prototype.toString.call(msg) === '[object Object]') {
              ;[tipMessage] = Object.values(msg).flat()
            }
            if (Object.prototype.toString.call(msg) === '[object Array]') {
              ;[tipMessage] = msg
            }
            this._show_error(tipMessage)
            reject(tipMessage)
          }
        }
      },
      fail: (err) => {
        this._show_error('请求响应失败')
        reject()
      }
    })

  }

  _show_error(msg) {
    wx.showToast({
      title: msg || '抱歉，出现了未知一个错误',
      icon: 'none',
      duration: 2000
    })
  }


  _refetch(...param) {
    refreshTokenFromServer(() => {
      this._request(...param, true);
    });
  }
}

export {
  HTTP
}
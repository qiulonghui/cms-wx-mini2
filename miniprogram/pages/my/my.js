import {
  config
} from '../../config.js'
import { HTTP } from '../../utils/http-p'
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const http = new HTTP()
const  app = getApp()

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    name:'微信用户'
  },
  onLoad() {
    const {nickname,avatar} = app.globalData.userInfo
    this.setData({
      avatarUrl: avatar||defaultAvatarUrl,
      name: nickname
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    console.log(avatarUrl)
    const access_token = wx.getStorageSync('access_token')

    wx.uploadFile({
      filePath: avatarUrl,
      name: 'avatarImg',
      url: config.api_base_url+'cms/file/',//服务器端接收图片的路径
      header:{Authorization: access_token},
      success:function(res){
        console.log(11111,res);//发送成功回调
        const statusCode = res.statusCode.toString()
        const data =JSON.parse(res.data)
        if (statusCode.charAt(0) === '2') {
          http.request({
            url: 'cms/user',
            method: 'put',
            data: {
              avatar: data[0].path,
            },
          })
        }else {
          const msg = data.message
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail:function(res){
        console.log(res);//发送失败回调，可以在这里了解失败原因
      }
    })
  },
  onBlur(e) {
    const value = e.detail.value
    http.request({
      url: 'cms/user',
      method: 'put',
      data: {
        nickname: value,
      }
    })
  },
  onChange(e) {
    const newVal = e.detail.value
    console.log(newVal,this.data.name,e)
    if(newVal !== this.data.name) {
      http.request({
        url: 'cms/user',
        method: 'put',
        data: {
          nickname: newVal,
        }
      })
      this.setData({
        name: newVal
      })
    }
  },
  onInput() {}
})
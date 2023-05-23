// app.js
import { HTTP } from './utils/http-p'
const http = new HTTP()

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    this.globalData = {
      userInfo: null
    };
    this.getAppInfo()
    this.getUserInfo()
  },
  async getAppInfo() {
    const result = await http.request({
      url: 'api/app',
    })
    this.globalData.env= result.env
    wx.reLaunch({
      url: '/pages/orderList/orderList',
    })
  },
  async getUserInfo() {
    const result = await http.request({
      url: 'cms/user/permissions',
    })
    this.globalData.userInfo= result
  },

  // onClickVantBack() {
  // }
});
!function () {
  //获取页面配置并进行页面分享配置
  var PageTmp = Page
  Page = function (pageConfig) {
    //1. 获取当前页面路由
    let routerUrl = ""
    wx.onAppRoute(function (res) {
      let pages = getCurrentPages(),
        view = pages[pages.length - 1];
      routerUrl = view.route
    })

    //2. 全局开启分享配置
    pageConfig = Object.assign({
      onShareAppMessage: function () {
        //分享给朋友
        //根据不同路由设置不同分享内容（微信小程序分享自带参数，如非特例，不需配置分享路径）
        // let shareInfo={}
        // let noGlobalSharePages=["index/index"]
        // //全局分享配置，如部分页面需要页面默认分享或自定义分享可以单独判断处理
        // if (!routerUrl.includes(noGlobalSharePages)){
        //   shareInfo = {
        //     title: "分享时的文案",
        //     imageUrl: wx.getStorageSync("这里放分享时所带图片的地址")
        //   }
        // }
        // return shareInfo
      },
      // onShareTimeline: function () {
        // //分享至朋友圈
        // let shareInfo={}
        // let noGlobalSharePages=["index/index"]
        // if (!routerUrl.includes(noGlobalSharePages)){
        //   shareInfo = {
        //     title: "分享时的文案",
        //     imageUrl: wx.getStorageSync("这里放分享时所带图片的地址")
        //   }
        // }
        // return shareInfo
      // }
    }, pageConfig);
    // 配置页面模板
    PageTmp(pageConfig);
  }
}()
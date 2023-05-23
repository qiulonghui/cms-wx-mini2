import { HTTP } from '../../utils/http-p'
const http = new HTTP()
const  app = getApp()

Page({
  data: {
    env:'dev',
    loaded:false,
    page:1,
    orderList: [],
    triggered: false,
  },
  onLoad() {
    this.setData({
      env: app.globalData.env
    })
    this.getOrderList(false)
  },
  onShow() {},
  onScrollBottom() {
    console.log("触底");
    this.getOrderList()
  },

  async getOrderList(tip=true) {
    wx.showLoading({
      title: '加载中',
    })
    const {items} = await http.request({
      url: 'v1/orderRepair/own',
      data: {
        page: this.data.page,
        count: 10
      }
    })
    this.setData({
      loaded:true
    })
    wx.hideLoading()
    if(items.length>0){
      this.setData({
        orderList: [...this.data.orderList,...items]
      })
      this.data.page++
    }else{
      if(tip) {
        wx.showToast({
          title: '没有更多数据了',
          icon:'none',
          duration: 2000
        })
      }
    }
  },

  onPulling(e) {
    // console.log('onPulling:', e)
  },

  async onRefresh(successTip = true) {
    if (this._freshing) return
    this._freshing = true
    console.log("触发下拉");
    this.data.page = 1
    const {items} = await http.request({
      url: 'v1/orderRepair/own',
      data: {
        page: 1,
        count: 10
      }
    })
    this.setData({
      loaded:true
    })
    this._freshing = false
    this.setData({
      triggered: false,
      orderList: items
    })
    this.data.page++
    if(successTip) {
      wx.showToast({
        title: '数据刷新成功',
        icon:'success',
        duration: 2000
      })
    }
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },

  toCreateOrder() {
    wx.navigateTo({
      url: '/pages/order/order?action=create'
    })
  },
  onClickCard(event) {
    console.log(this.data.env)
    if(this.data.env==='dev') return
    const id=event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/order?id=${id}&action=edit`
    })
  }

});
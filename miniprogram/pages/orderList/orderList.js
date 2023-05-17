import {
  HTTP
} from '../../utils/http-p'
const http = new HTTP()
Page({
  data: {
    orderList: [1, 2, 3, 4, 5]
  },
  onLoad(options) {
    http.request({
      url: 'v1/orderRepair',
      data: {
        page: 1,
        count: 10
      }
    })
  },
  toCreateOrder() {
    http.request({
      url: 'v1/orderRepair',
      data: {
        page: 1,
        count: 10
      }
    })
    return
    wx.navigateTo({
      url: '/pages/order/order?action=create'
    })
  },
  onClickCard() {
    wx.navigateTo({
      url: '/pages/order/order?id=1&action=edit'
    })
  }
});
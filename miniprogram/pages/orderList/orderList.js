import { HTTP } from '../../utils/http-p'
const http = new HTTP()
Page({
  data: {
    orderList: []
  },
  onLoad(options) {
    this.getOrderList()
  },
  async getOrderList() {
    const {items} = await http.request({
      url: 'v1/orderRepair',
      data: {
        page: 1,
        count: 5
      }
    })
    this.setData({
      orderList: items
    })
  },

  toCreateOrder() {
    wx.navigateTo({
      url: '/pages/order/order?action=create'
    })
  },
  onClickCard(event) {
    const id=event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/order?id=${id}&action=edit`
    })
  }
});
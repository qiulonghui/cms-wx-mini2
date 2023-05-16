Page({
  data: {
    orderList:[1,2,3,4,5]
  },
  toCreateOrder() {
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

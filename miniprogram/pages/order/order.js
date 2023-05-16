// pages/order/order.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({
  data: {
    id: null,
    action: 'create',
    pageTitle: '',
    name: "",
    phone: "",
    depart: "",
    address: "",
    desc: ""
  },
  onLoad(options) {
    this.data.id = options.id
    this.data.action = options.action
    let title
    if (this.data.action === 'create') {
      title = '新建报修'
    }else{
      title = '修改工单'
    }
    this.setData({
      pageTitle: title
    })
  },

  onClickVantBack() {
    wx.navigateBack()
  },
  isNullValue(value) {
    if (value === '' || value == null) return true
    return false
  },
  onClickSaveBtn() {
    const name = this.data.name.trim()
    const phone = this.data.phone.trim()
    const depart = this.data.depart.trim()
    const address = this.data.address.trim()
    const desc = this.data.desc.trim()
    const flag = this.isNullValue(name) || this.isNullValue(phone) || this.isNullValue(depart) || this.isNullValue(address) || this.isNullValue(desc)
    if (flag) {
      Toast('请将信息填写完整');
      return
    }
  }
})
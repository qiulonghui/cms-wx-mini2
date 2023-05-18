// pages/order/order.js
import Toast from '@vant/weapp/toast/toast';
import { HTTP } from '../../utils/http-p'
const http = new HTTP()

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
      this.getOrder()
    }
    this.setData({
      pageTitle: title
    })
  },

  async getOrder() {
    wx.showLoading({
      title: '请稍后...',
    })
    const result = await http.request({
      url: `v1/orderRepair/${this.data.id}`,
    })
    wx.hideLoading()
    const {name,phone,depart,address,desc} = result
    this.setData({
      name,
      phone,
      depart,
      address,
      desc
    })
  },
  onClickVantBack() {
    wx.navigateBack()
  },
  isNullValue(value) {
    if (value === '' || value == null) return true
    return false
  },
  async handleOrder(id,data,method) {
    wx.showLoading({
      title: '请稍后...',
    })
    const {message} = await http.request({
      url: 'v1/orderRepair' + (id? `/${id}` : ''),
      data,
      method
    })
    wx.hideLoading()
    wx.showToast({
      title: message,
      icon:'success',
      duration: 2000,
      mask:true
    })
    setTimeout(()=>{
      wx.reLaunch({
        url: '/pages/orderList/orderList',
      })
      // wx.switchTab({
      //    url: '/pages/orderList/orderList',
      //    success: function(e) {
      //     // 获取跳转后的页面实例
      //      var page = getCurrentPages().pop();
      //      if (page == undefined || page == null) return
      //      page.onRefresh(false);
      //    }
      // })
    },1800)
    
  },
  async onClickSaveBtn() {
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
    const data = {
      name,
      phone,
      depart,
      address,
      desc
    }
    let method
    let id = this.data.id
    if(this.data.action === 'create') {
      method= 'post'
    }else{
      method= 'put'
    }
    this.handleOrder(id,data,method)
  }
})
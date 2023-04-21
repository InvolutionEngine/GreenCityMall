// pages/after_sales/after_sales.js
const db = wx.cloud.database()
const time = require('../../utils/timeTool.js')
const state_after_sales_service_time = require('../../utils/timeTool.js')
const success_after_sales_service_time = require('../../utils/timeTool.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order:[],
  },
  get_Order(){
    let that = this
    wx.showLoading({
      title: '数据加载中',
    })
    db.collection('order').where({
    }).orderBy('time','desc').get().then(res=>{
      wx.hideLoading()
      that.setData({
        order:that.changeTime(res.data),
        order:that.changeTime_state_after_sales_service_time(res.data),
        order:that.changeTime_success_after_sales_service_time(res.data),
      })
     
      console.log('获取订单成功',res.data)
    }).catch(err=>{
      console.log('获取订单失败',err)
    })
  },
  changeTime(e){
    for(let i =0;i<e.length;i++){
      console.log('changeTime',e)
      e[i].time = time.formatTime(new Date(e[i].time))
      if(i+1 == e.length){
        return e
      }
    }
  },
  //结束售后
  success_after_sales(e){
    let that = this 
    let id =e.currentTarget.dataset.id
    wx.showModal({
      title:'提示',
      content:'是否确认完成售后服务',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          wx.showLoading({
           title:'正在为您加载',
         })
         wx.cloud.callFunction({
          name:"order",
          data:{
            method:"success_after_sales_service",
            id : id,
          }
        }).then(order=>{
          console.log(order)
          that.get_Order()
        })
        }else if(res.cancel){
           console.log('用户点击取消')
        }
      }
   })
  },
  changeTime_state_after_sales_service_time(e){
    for(let i =0;i<e.length;i++){
     if(e[i].state_after_sales_service_time){
        e[i].state_after_sales_service_time = state_after_sales_service_time.formatTime(new Date(e[i].state_after_sales_service_time))
      }
      if(i+1 == e.length){
        return e
      }
    }
  },
  changeTime_success_after_sales_service_time(e){
    for(let i =0;i<e.length;i++){
     if(e[i].success_after_sales_service_time){
        e[i].success_after_sales_service_time = success_after_sales_service_time.formatTime(new Date(e[i].success_after_sales_service_time))
      }
      if(i+1 == e.length){
        return e
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.get_Order()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
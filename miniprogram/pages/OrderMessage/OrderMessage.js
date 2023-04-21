// pages/OrderMessage/OrderMessage.js
const db = wx.cloud.database()
const time = require('../../utils/timeTool.js')
const cancel_order_time = require('../../utils/timeTool.js')
const receipt_order_time = require('../../utils/timeTool.js')
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // choose_Tab:'已付款',
    active:0,
    Logistics_active:4,
    order:[],
    Logistics:false,
    steps: [
      {
        text: '已发货',
        desc: '包裹正在准备揽收 06-04 14.20',
        inactiveIcon: 'todo-list-o',
        activeIcon: 'success',
      },
      {
        text: '已揽件',
        desc: '华东东方美谷的F634员工[13600971316]已揽收 06-05 08.33',
        inactiveIcon: 'todo-list-o',
        activeIcon: 'success',
      },
      {
        text: '运输中',
        desc: '快件送达华东东方美谷 06-05 11.21',
        inactiveIcon: 'todo-list-o',
        activeIcon: 'success',
      },
      {
        text: '运输中',
        desc: '快件离开华东东方美谷已发往福州中转 06-06 19.53',
        inactiveIcon: 'todo-list-o',
        activeIcon: 'success',
      },
      {
        text: '已送达',
        desc: '快件已到达福建师范大学协和学院菜鸟驿站 06-07 10.01',
        inactiveIcon: 'todo-list-o',
        activeIcon: 'success',
      }
    ],
  },
  //确认收货
  receipt_goods(e){
    let that = this 
    let id =e.currentTarget.dataset.id
    wx.showModal({
      title:'提示',
      content:'是否确认收货',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          wx.showLoading({
           title:'正在为您加载',
         })
         wx.cloud.callFunction({
          name:"order",
          data:{
            method:"receipt_order",
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


  //取消订单
  delete_order(e){
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title:'提示',
      content:'是否取消',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name:"order",
            data:{
              method:"cancel_order",
              id : id,
            }
          }).then(order=>{
            console.log(order)
            that.get_Order()
          })
          wx.showLoading({
           title:'正在为您取消',
         })
         
        }else if(res.cancel){
           console.log('用户点击取消')
        }
      }
   })
  },

  //物流弹窗
  Logistics_open(){
      this.setData({
        Logistics:true
      })
  },
  Logistics_close(){
    this.setData({
      Logistics:false
    })
  },

  getActive(e){
    this.setData({
      active:e.active
    })
    console.log('active',e.active)
  },
  //时间转化
  changeTime(e){
    for(let i =0;i<e.length;i++){
      console.log('changeTime',e)
      e[i].time = time.formatTime(new Date(e[i].time))
      if(i+1 == e.length){
        return e
      }
    }
  },
  changeTime_receipt_order_time(e){
    for(let i =0;i<e.length;i++){
     if(e[i].receipt_order_time){
        e[i].receipt_order_time = receipt_order_time.formatTime(new Date(e[i].receipt_order_time))
      }
      if(i+1 == e.length){
        return e
      }
    }
  },
  changeTime_cancel_order_time(e){
    for(let i =0;i<e.length;i++){
     if(e[i].cancel_order_time){
        e[i].cancel_order_time = cancel_order_time.formatTime(new Date(e[i].cancel_order_time))
      }
      if(i+1 == e.length){
        return e
      }
    }
  },

  onChange(event) {
    wx.showToast({
      title: `切换到 ${event.detail.title}`,
      icon: 'none',
    });
  },

  //获取订单
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
        order:that.changeTime_cancel_order_time(res.data),
        order:that.changeTime_receipt_order_time(res.data),
      })
     
      console.log('获取订单成功',res.data)
    }).catch(err=>{
      console.log('获取订单失败',err)
    })
  },
  //开启售后
  state_after_sales(e){
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title:'提示',
      content:'是否进行售后',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name:"order",
            data:{
              method:"state_after_sales_service",
              id : id,
            }
          }).then(order=>{
            console.log(order)
            that.get_Order()
          })
          wx.showLoading({
           title:'正在为您取消',
         })
         
        }else if(res.cancel){
           console.log('用户点击取消')
        }
      }
   })
  },
    //获取订单
  // get_order(state){
  //   let that = this
  //   wx.cloud.callFunction({
  //     name:"order",
  //     data:{
  //       method:"to_state_get_order",
  //       state:state,
  //     }
  //   }).then(res=>{
  //     console.log("获取订单",res.result.data)
  //   })
  // },
  //goto_evaluate
  goto_evaluate(e){
    let that = this
    let Id = e.currentTarget.dataset.id
    wx.showModal({
      title:'提示',
      content:'是否进行评价',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          console.log('AAA',Id)
          wx.redirectTo({
            // ../productsDetail/productsDetail?id=${Id} 为什么不行
            url: '../productsDetail/productsDetail?id=' + Id
          })
        }else if(res.cancel){
           console.log('用户点击取消')
        }
      }
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.getActive(options)
    // this.setData({
    //   active:options.active
    // })
    // console.log('active',options.active)
   that.get_Order()
    // that.get_order(that.data.choose_Tab)
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
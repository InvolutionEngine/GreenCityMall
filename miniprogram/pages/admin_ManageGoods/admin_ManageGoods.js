// pages/admin_ManageGoods/admin_ManageGoods.js
const time = require('../../utils/timeTool.js')
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:"全部",
    goods:[],
    category_list:[{'name':'全部'}]
  },
  //选择条件
  select_category(e){
    let that = this
    console.log('select_category',e.detail.value)
    let category = that.data.category_list[e.detail.value*1].name
    console.log('category',category)
    that.setData({
      category:category
    })
    if( category == '全部'){
      that.get_goods()
    }else{
      wx.showLoading({
        title: '正在搜索中',
      })
      wx.cloud.callFunction({
        name:"goods_manage",
        data:{
          method:"to_category",
          category:category
        }
      }).then(res => {
        wx.hideLoading()
        console.log('获取res',res)
        console.log('获取res.result.data',res.result.data)
        that.setData({
          goods:that.changeTime(res.result.data)
        })
      })
    }
  },

  //获取分类
  get_category(){
    let that =this
    db.collection('category').get().then(res=>{
      let list = that.data.category_list.concat(res.data)
      console.log('get_category',res)
      that.setData({
        category_list:list
      })
    })
  },

  search(e){
    let that =this
    if(e.detail.value){
      wx.showLoading({
        title: '正在搜索中',
      })
      wx.cloud.callFunction({
        name:"goods_manage",
        data:{
          method:"search",
          name:e.detail.value
        }
      }).then(res => {
        wx.hideLoading()
        that.setData({
          goods:that.changeTime(res.result.data)
        })
      })
    }else{
      that.get_goods()
    }
    
  },

  //时间转化
  changeTime(e){
    if(e.length == 0){
      return e
    }else{
      for(let i =0;i<e.length;i++){
        e[i].time = time.formatTime(new Date(e[i].time))
        if(i+1 == e.length){
          return e
        }
      }
    }
    
  },

  get_goods(){
    let that =this
    wx.showLoading({
      title: '正在读取中',
    })
    wx.cloud.callFunction({
      name:"goods_manage",
      data:{
        method:"get_goods"
      }
    }).then(res => {
      wx.hideLoading()
        console.log(res.result.data)
        that.setData({
          goods:that.changeTime(res.result.data)
        })
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.get_goods()
    that.get_category()
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
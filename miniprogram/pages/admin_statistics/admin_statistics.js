// pages/admin_statistics/admin_statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:{}
  },
  //更新数据
  update_data(){
    let that =this
    wx.showModal({
      title:'提示',
      content:'是否刷新数据',
      success(res){
       wx.showToast({
        title: '正在刷新中',
        icon:"loading"
      })
      that.get_data()
      }
    }),
    this.get_data()
  },
  get_data(){
    let that = this
    wx.cloud.callFunction({
      name:"order",
      data:{
        method:"get_data"
      }
    }).then(res=>{
      console.log('数据',res)
      that.setData({
        number:res.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_data()
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
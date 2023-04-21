// pages/car/car.js
const db = wx.cloud.database()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    goods_list:[],
    total_money : 0,
    result:[],
    if_totalChoose:false
  },

  //购物车添加到订单
  submit_order(){
    let that = this
   if(that.data.result.length !=0 ){
    wx.showLoading({
      title: '正在提交中',
    })
    let goods = []
    for(let i=0;i<that.data.result.length;i++){
      goods.push(that.data.goods_list[that.data.result[i]*1])
      if(i+1 == that.data.result.length){
        wx.setStorage({// 使用数据缓存 传递数据
          key:"goods",
          data:goods
        })
        wx.navigateTo({
          url: '../submitOrder/submitOrder?is_car=true',
        })
      }
    }
   }else{
      wx.showToast({
        title: '请确定您有选择商品',
        icon:"none"
      })
   }
  },
  
  delete_cargoods(e){
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
       title:'提示',
       content:'是否删除该商品',
       success(res){
         if(res.confirm){
           console.log('用户点击确定')
          //
           wx.showLoading({
            title:'正在为您删除',
          })
          db.collection('car').doc(id).remove().then(res=>{
            wx.hideLoading()
            wx.showToast({
              title: '已成功删除'
            })
            that.get_car()  //删除后重新获取购物车
          })
           //
         }else if(res.cancel){
            console.log('用户点击取消')
         }
       }
    })

  },
  selected_all(e){
    let that = this
    let name = e.currentTarget.dataset.name
    let result =[]
    if(name=='all_true'){
      for(let i=0 ; i<that.data.goods_list.length;i++){
        result.push(i+'')
        if(i+1 ==that.data.goods_list.length){
          that.get_totalMoney(result)
          that.setData({
            result:result,
            if_totalChoose:true
          })
        }
      }
    }else{
      that.setData({
          result:[],
          if_totalChoose:false,
          total_money:0
      })
    }
  },
  save_selectedNum(e){
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(e)
    that.setData({
      ['goods_list['+index+'].products_num']:e.detail
    })
      that.get_totalMoney(that.data.result)
      db.collection('car').doc(that.data.goods_list[index]._id).update({
        data:{
          products_num:e.detail
        }
      })
  },


  //计算
  get_totalMoney(pro){
    console.log(pro)
    let that = this
    let total_money =0
    let  goods_list = that.data.goods_list
    for(let i=0; i<pro.length; i++){
      let index = parseInt(pro[i])
      total_money = total_money + (goods_list[index].products_num*goods_list[index].products_price)
      if(i+1 == pro.length){
        that.setData({
          total_money:parseFloat((total_money*100).toFixed(2))
        })
      }
    }
  },
  //add to
  add_to_totalMoney(e){
    let that = this
    console.log(e)
    let selected_goods = e.detail
    that.setData({
      result:selected_goods
    })
    that.get_totalMoney(selected_goods)
  },

  get_car(){
    let that = this
    wx.showLoading({
      title:'正在寻找您的购物车',
    })
    db.collection('car').orderBy('time','desc').get().then(res=>{
      wx.hideLoading()
      console.log('购物车',res)
      that.setData({
        goods_list:res.data
      })
      that.get_totalMoney([])
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this
    that.get_car()
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
// pages/submitOrder/submitOrder.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    goods:{},
    remarks:"",
    total_money:0,
    is_car:false
  },
    //购物车购买后消除
    delete_goods(){
      let that = this
      let goods = that.data.goods
      for(let i =0;i<goods.length;i++){
        db.collection('car').doc(goods[i]._id).remove()
      }
    },

  //销量云函数
  inc_sales(){
    let that = this
    let goods = that.data.goods
    for(let i =0 ;i<goods.length;i++){
      wx.cloud.callFunction({
        name:"goods_manage",
        data:{
          method:"to_sales",
          id:goods[i].products_id,
          num:goods[i].products_num,
        }
      })
    }
    
  },
  //付款事件
  payOrder(){
    let that = this
    if(that.data.address =={} || that.data.goods.length == 0 ){       //!!!!!!!!
      wx.showToast({
        title: '请将订单信息填写完毕呦！',
        icon:"none"
      })
    }else{
      wx.showLoading({
        title: '正在加载中',
      })
      db.collection('order').add({
        data:{
          address:that.data.address,
          goods:that.data.goods,
          remarks:that.data.remarks,
          total_money:that.data.total_money,
          type:"已付款",
          time:db.serverDate(),
        }
      }).then(res=>{
        wx.hideLoading()
        wx.showToast({
          title: '支付成功',
          duration: 3000//持续的时间
        })
     
        that.inc_sales()//云函数调用
        if(that.data.is_car){
          that.delete_goods()//购物车购买后消除
        }
        //清除缓存
        wx.removeStorage({
            key: 'goods',
            success (res) {
            // //回退
            wx.navigateBack({
              delta: 1
            })
            // wx.redirectTo({
            //   url: '../car/car,
            // })
          }
        })
        console.log('支付成功',res)
      }).catch(err=>{
        wx.showToast({
          title: '支付失败',
          icon:"error"
        })
        console.log('支付失败',err)
      })
    }
   
  },


   //计算
   get_totalMoney(pro){
    console.log(pro)
    let that = this
    let total_money =0
    let  goods_list = pro
    for(let i=0; i<goods_list.length; i++){
      total_money = total_money + (goods_list[i].products_num*goods_list[i].products_price)
      if(i+1 == goods_list.length){
        that.setData({
          total_money:parseFloat((total_money*100).toFixed(2))
        })
      }
    }
  },


  inputRemarks(e){
    this.setData({
      remarks:e.detail.value
    })
  },
  
  get_address(){
    let that = this
    wx.chooseAddress({
      success: (res) => {
        console.log('地址',res)
        that.setData({
          address:res
        })
      },
    })
  },
  get_goods(){  //获取商品
    let that = this
    wx.getStorage({
      key: "goods",
      success(res) {
        console.log('购物车缓存获取成功',res.data)

        // 要是没有值 基本是 data 没有初始化 已经 setData没写好
        that.setData({  
          goods:res.data
        })
        that.get_totalMoney(res.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if(options.is_car){
      that.setData({
        is_car:true
      })
    }
    that.get_goods()
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
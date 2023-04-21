// pages/productsDetail/productsDetail.js
const time = require('../../utils/timeTool.js')
const db =wx.cloud.database()
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    is_user:false,
    current: 0,
    products:{},
    choose_num:1,
    choose_spe:"",
    show: true,
    evaluate:"",
    evaluate_list:[],
    can_evaluate:false
  },
  into_customer(){
    wx.navigateTo({
      url: "../car/car"
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
  //检测是否有评价资格
  get_can_evaluate(id){
    let that = this
    db.collection('order').where({
      type:_.eq("已结单"),
      goods:_.elemMatch({
        products_id: _.eq(id),
      }),
    }).get().then(res=>{
      console.log('资格',res)
      if(res.data.length){
        that.setData({
          can_evaluate:true
        })
      }
    })
  },
  //用户
  get_user(){
    let that = this
    db.collection('user').get().then(res=>{
      console.log('get_user',res.data[0])
      if(res.data.length > 0 ){
        that.setData({
          user:res.data[0],  //将从数据库读到的数据set赋值到页面上
          is_user:true
        })
      }else{
        that.setData({
          is_user:false
        })
      }
    })
  },
  //获取评价
  get_evaluate(products_id){
    let that = this
    db.collection('evaluate').where({
      products_id:products_id
    }).get().then(res=>{
      wx.hideLoading()
      console.log('获取评价成功',res)
      that.setData({
        evaluate_list:that.changeTime(res.data)
      })
    }).catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: '获取失败',
        icon:"error"
      })
      console.log('获取评价失败',err)
    })
  },
  //发送评价
  send_evaluate(){
    let that =this
    let evaluate =that.data.evaluate
    let user = that.data.user
    if(that.data.can_evaluate){
      if(evaluate){
        wx.showLoading({
          title: '正在发送',
        })
        console.log('判断',that.data)
        db.collection('evaluate').add({
          data:{
            evaluate_meg:evaluate,
            time:db.serverDate(),
            user_name:user.user_message.nickName,
            avg:user.user_message.avatarUrl,
            products_id:that.data.products._id
          },
        }).then(res=>{
          wx.hideLoading()
          console.log('评价',res)
          that.get_evaluate(that.data.products._id)
        })
      }else{
        wx.showToast({
          title: '请输入评价吧',
          icon:"none"
        })
      }
    }else{
      wx.showToast({
        title: '你还没有买过这个商品哦',
        icon:"none"
      })
    }
    
  },
  //输入评价
  input_evaluate(e){
    this.setData({
      evaluate:e.detail.value,
    })
  },
  //立即购买
  shoppingOrder(){
    let that = this
    let products = that.data.products
    let goods = []
    if(that.data.choose_spe==''){
      wx.showToast({
        title: '你还没有选择商品类型呢',
        icon:"none"
      })
    }else{
      let temp = {
        products_id:products._id,
        products_img:products.url[0],
        products_name:products.name,
        products_price:products.price,
        products_discount:products.discount[0],
        products_pro_price:products.pro_price,
  
        products_spe:that.data.choose_spe,
        products_num:that.data.choose_num,
      }
      goods.push(temp)
      wx.setStorage({// 使用数据缓存 传递数据
        key:"goods",
        data:goods
      })
      wx.navigateTo({
        url: '../submitOrder/submitOrder',
      })
    }
  },


  add_into_car(){
    let that = this
    let products =that.data.products
    if(that.data.choose_spe==''){
      wx.showToast({
        title: '你还没有选择商品类型呢',
        icon:"none"
      })
    }else{
        wx.showLoading({
          title: '正在为您添加哟',
        })
        db.collection('car').where({
          products_id:products._id,
          products_spe:that.data.choose_spe,
          products_num:that.data.choose_num
        }).get().then(res=>{
          if(res.data.length>0){
            wx.hideLoading()
            wx.showToast({
              title: '有一样的啦,请确认不用重复购买呦！',
              icon:"none",
              duration: 2000
            })
          }else{
            db.collection('car').add({
              data:{
                products_id:products._id,
                products_img:products.url[0],
                products_name:products.name,
                products_price:products.price,
                products_discount:products.discount[0],
                products_pro_price:products.pro_price,

                products_spe:that.data.choose_spe,
                products_num:that.data.choose_num,
                time:db.serverDate()
              }
            }).then(res=>{
              wx.hideLoading()
              wx.showToast({
                title: '添加成功',
              })
              console.log('购物车添加成功',res)
            })
          }
        })
      }
  },
  getProduct(id){
    let that = this
    wx.showLoading({
      title: '正在努力加载',
    })
    db.collection('shopping_products').doc(id).get().then(res=>{
      wx.hideLoading()
      console.log('获取成功',res)
      that.setData({
        products:res.data
      })
    }).catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: '获取失败',
        icon:"error"
      })
      console.log('getProductFail',err)
    })
  },
  popup_open() {
    this.setData({ show: true });
  },

  popup_close() {
    this.setData({ show: false });
  },
  onChange(event) {
    this.setData({
      Array:res.data,
    });
  },

  onStepper(e){
    let that = this
    that.setData({
      choose_num:e.detail
    })
  },
  onSpe(e){
    let that = this
    let spe = e.currentTarget.dataset.spe
    that.setData({
      choose_spe:spe
    })
    // console.log(e.detail)
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getProduct(options.id)
    that.get_user()
    that.get_evaluate(options.id)
    that.get_can_evaluate(options.id)
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
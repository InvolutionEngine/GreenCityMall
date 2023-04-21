// pages/market/market.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_category:"全部",
    category:[{name:"全部"}],//从数据库拿的
    goods:[],
    id:"",
    areaList:{
      province_list: {
        110000: '北京市',
        120000: '天津市',
      },
      city_list: {
        110100: '北京市',
        120100: '天津市',
      },
      county_list: {
        110101: '东城区',
        110102: '西城区',
      },
    },
    search_list:[],
    if_open_search_box:false,
    if_area:false
  },
  click(e){
    console.log('click',e.currentTarget.dataset)
    let id =e.currentTarget.dataset.id
    // console.log('click',e.data)
    wx.showLoading({
      title: '正在为您跳转页面',
      icon:"none"
    })
    wx.navigateTo({
      url: "../productsDetail/productsDetail?id="+id
    })
    wx.hideLoading()
  },


  area_open(){
    this.setData({
      if_area:true
    })
  },
  area_close(){
    this.setData({
      if_area:false
    })
  },
  //拿到搜索栏焦点
  open_search_box(){
    this.setData({
      if_open_search_box:true
    })
  },
  //失去搜索栏焦点
  close_search_box(){
    this.setData({
      if_open_search_box:false
    })
  },

  search(e){
    let that = this 
    let like = like
    console.log('search',e)
    if(e.detail){
      wx.showLoading({
        title: '搜索中',
      })
      db.collection("shopping_products").where({
        name:db.RegExp({
          regexp:e.detail,
          options:'i',
        }),
      }).get().then(res=>{
        wx.hideLoading()
    
        console.log('搜索中',res)
        that.setData({
          search_list:res.data,
        })
      })
    }else{
      that.setData({
        search_list:[],
      })
    }
  },
  //获取分类
  get_category(){
    let that = this
    let category =that.data.category
    db.collection("category")
    .orderBy("num","asc")
    .get()
    .then(res=>{
      console.log("获取分类",res.data)
      that.setData({
        category:category.concat(res.data)
      })
    })
  },
  //选择分类
  select_category(e){
    let that = this
    let name = e.currentTarget.dataset.name
    that.setData({
      select_category:name,
    })
    that.get_goods(name)
  },
  //获取商品
  get_goods(category){
    let that = this
    if( category == '全部'){
      db.collection("shopping_products")
      .get()
      .then(res=>{
        console.log("获取商品get_goods",res.data)
        that.setData({
          goods:res.data
        })
      })
    }else{
      db.collection("shopping_products").where({
        category:category  //从数据库里拿数据  左边这个要看数据库的值名
      })
      .get()
      .then(res=>{
        console.log('else',res.data)
        that.setData({
          goods:res.data
        })
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this 
    that.get_category()
    that.get_goods("全部")
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
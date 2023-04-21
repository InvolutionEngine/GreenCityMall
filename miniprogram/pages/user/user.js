// pages/user/user.js
const db =wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    if_show:false,
    admin_name:"",
    password:"",
    about: "none",
    version: "none",
  },
  //团队
  showPop() {
    if (this.data.about === "none") {
      this.setData({
        about: "block"
      })
    } else {
      this.setData({
        about: "none"
      })
    }
  },
  //版本信息
  show_version_Pop() {
    if (this.data.version === "none") {
      this.setData({
        version: "block"
      })
    } else {
      this.setData({
        version: "none"
      })
    }
  },
  
  //登录按钮
  loginInto(){
    let that = this 
    wx.showLoading({
      title: '正在努力登录中',
    })
    if(that.data.admin_name == '' || that.data.password == ''){
      wx.showToast({
        title: '账户或者密码还没输入呢',
        icon:"none"
      })
    }else{
      db.collection('admin').where({
        admin_name:that.data.admin_name,
        password:that.data.password,
      }).get().then(res=>{
        console.log("dl",res)
        if(res.data.length == 0){
          wx.showToast({
            title: '账户或密码错误',
          })
        }else{
          app.globalData.admin = res.data[0]
          wx.navigateTo({
            url: '../admin/admin',
          })
        }
      })
    }
    wx.hideLoading()
    that.setData({
      if_show:false
    })
    wx.showTabBar()
  },
  //登录信息填写
  input_login(e){
    let that = this
    let name = e.currentTarget.dataset.name
    that.setData({
      [name]:e.detail.value
    })
  },
  setlogin_false(){
    this.setData({
      if_show:false
    })
    wx.showTabBar()
  },
  login_open(){
    this.setData({
      if_show:true
    })
    wx.hideTabBar()
  },
  login_close(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定不登录嘛',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          that.setlogin_false()       //记得写that 不然undefind
          console.log('用户点击确定')
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
    
  },

  my_address(){
    let that = this
    wx.chooseAddress({
      success: (res) => {
        console.log('地址',res)
      },
    })
  },


//显示我的界面  注册
  register(){
    let that = this
    wx.showModal({
      title:'提示',
      content:'您还没注册过 是否需要注册',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          //---------------------
          wx.getUserProfile({
            desc:'需要进行注册哦',
            success:(user_message)=>{
              console.log(user_message)
              wx.showLoading({
                title: '正在为您注册',
              })
             db.collection('user').add({
               data:{
                user_message:user_message.userInfo
               }
             }).then(user=>{
               wx.hideLoading()
               wx.showToast({
                 title: '注册成功',
               })
                that.login()
             })
            }
          })
          wx.showModal({
            title:'提示',
            content:'您还需要进一步完善信息哦',
            success(res){
              if(res.confirm){
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../user_enroll/user_enroll'     
                })
              }else{
                console.log('用户点击取消')
              }
            }
          })
         //---------------------
        }else if(res.cancel){
           console.log('用户点击取消')
        }
      }
   })
  },

  login(){
    let that = this
    db.collection('user').get().then(res=>{
      if(res.data.length > 0 ){
        that.setData({
          user:res.data[0]  //将从数据库读到的数据set赋值到页面上
        })
      }else{
        that.register()
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this
    that.login()
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
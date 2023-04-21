// pages/user_enroll_subscriber/user_enroll_subscriber.js
const db =wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    personal_message:"",
    username:"",
  },
  get_user(){
    let that = this
    db.collection('user').get().then(res=>{
      console.log('get_user',res.data[0])
      if(res.data.length > 0 ){
        that.setData({
          user:res.data[0],  //将从数据库读到的数据set赋值到页面上
        })
      }
    })
  },
  get_nickName(e){
    if(e.detail.value.length>0)
    {
      this.setData({
        username:e.detail.value,
      })
    }else{
      this.setData({
        username:user.user_message.nickName,
      })
    }
    console.log('get_nickName',e.detail.value)
  },
  get_personal_message(e){
    this.setData({
      personal_message:e.detail.value,
    })
    console.log('get_personal_message',e.detail.value)
  },
  user_message_upload(e){
    let that = this
    let username =that.data.username
    let personal_message = that.data.personal_message
    let id =that.data.user._id
    console.log('username',username)
    console.log('personal_message',personal_message)
    // console.log('?',that.data.user._id)
    // console.log('id',id)
    wx.cloud.callFunction({
      name:"user",
      data:{
        method:"user_enroll_subscriber_upload",
        id:id,
        username:username,
        personal_message:personal_message
      }
    })

    wx.switchTab({  
      url: '../user/user',
    })
    wx.showToast({
      title: '更新成功',
      icon:"loading"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_user()
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
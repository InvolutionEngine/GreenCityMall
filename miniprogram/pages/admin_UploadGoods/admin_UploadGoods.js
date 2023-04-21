// pages/admin_UploadGoods/admin_UploadGoods.js
const db =wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",////
    pro_price:0,////
    price:0,////
    category:[],/////
    select_category:"",//这是选中的
    if_category:false,
    if_spe:false,
    input_spe:"",
    spe:[],////
    url:[],////
    if_swiper:false,
    details_img:[],////
    if_details:false,
    discount:[],////
    sales:0,////
    if_discount:false,
    input_discount:"",
  },

  async Total_upload(){
    let that = this
    let url = that.data.url
    let details_img = that.data.details_img
    wx.showLoading({
      title: '正在上传中',
    })
    for(let i = 0;i<url.length;i++){
      var timestamp = new Date().getTime()
      await wx.cloud.uploadFile({
        cloudPath: 'shopping_products/'+timestamp+'_'+i+''+'.png',
        filePath: url[i], // 文件路径
      }).then(async res => {
        // get resource ID
        console.log(res.fileID)
        url[i] = res.fileID
        //
        if(i+1 == url.length){     //判断url传完了没
          for(let j = 0;j<details_img.length; j++){
            console.log('jjj')
            var timestamp_a = new Date().getTime()
            await wx.cloud.uploadFile({
              cloudPath: 'shopping_details/'+timestamp_a+'_'+j+''+'.png',
              filePath: details_img[j], // 文件路径
            }).then(res_1 => {
              // get resource ID
              console.log(res_1.fileID)
              details_img[j] = res_1.fileID
              if(j+1 ==  details_img.length){   //判断details_img传完了没
                //////////////
                // 调用云函数
                /////////////
                wx.cloud.callFunction({
                  name:"goods",   //云函数名称！！1
                  data:{
                    name:that.data.name,
                    pro_price:that.data.pro_price,
                    price:that.data.price,
                    category:that.data.select_category,
                    spe:that.data.spe,
                    url:url,
                    details_img:details_img,
                    sales:0,
                    discount:that.data.discount
                  }
                }).then(res_2=>{
                  wx.hideLoading()
                  console.log('',res_2)
                }).then(err=>{
                  console.log(err)
                })
              }
            }).catch(error => {
              // handle error
              console.log(error)
            })
          }
        }

      }).catch(error => {
        // handle error
      })
     
    }
  },

  //单选框选择
  select_radio(e){
    this.setData({
      select_category: e.detail,
    });
    console.log(e.detail)
  },
  //获取商品分类
  get_category(){
    let that = this
    db.collection('category').get().then(res=>{
      console.log('获取商品分类',res.data)
      that.setData({
        category:res.data
      })
    })
  },
    // 商品标签弹窗控制开关
    inputDiscount_open(){
      this.setData({
        if_discount:true
      })
    },
    inputDiscount_close(){
      this.setData({
        if_discount:false
      })
    },
  // 商品分类弹窗控制开关
  inputCategory_open(){
    this.setData({
      if_category:true
    })
  },
  inputCategory_close(){
    this.setData({
      if_category:false
    })
  },

  //长按删除图片swiper
  delete_swiper_img(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let url = that.data.url
    wx.showModal({
      title: '请注意',
      content:'是否需要删除该图片',
      success(res){
        if(res.confirm){
          console.log('用户确定')
          url.splice(index,1)
          that.setData({
            url:url
          })
        }else if(res.cancel){
          console.log('用户取消')
        }
      }
    })
  },
  //长按删除图片details
  delete_details_img(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let details_img = that.data.details_img
    wx.showModal({
      title: '请注意',
      content:'是否需要删除该图片',
      success(res){
        if(res.confirm){
          console.log('用户确定')
          details_img.splice(index,1)
          that.setData({
            details_img:details_img
          })
        }else if(res.cancel){
          console.log('用户取消')
        }
      }
    })
  },

// 详情页弹窗控制开关
  inputDetails_open(){
    this.setData({
      if_details:true
    })
  },
  inputDetails_close(){
    this.setData({
      if_details:false
    })
  },
  //上传详情页
  add_details(){
    let that = this
    let details_img = that.data.details_img
    wx.chooseImage({
      count: 9-details_img.length,//最多上限9张
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          details_img:details_img.concat(tempFilePaths)
        })
      }
    })
  },

// 轮播图弹窗控制开关
  inputSwiper_open(){
    this.setData({
      if_swiper:true
    })
  },
  inputSwiper_close(){
    this.setData({
      if_swiper:false
    })
  },

  //上传轮播图
  add_swiper(){
    let that = this
    let url = that.data.url
    wx.chooseImage({
      count: 9-url.length,//最多上限9张
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          url:url.concat(tempFilePaths)
        })
      }
    })
  },


  inputSpe_open(){
    this.setData({
      if_spe:true
    })
  },
  inputSpe_close(){
    this.setData({
      if_spe:false
    })
  },
  //添加标签
  add_discount(){
    let that = this
    if(that.data.input_discount){
      let discount = that.data.discount
      discount.push(that.data.input_discount)
      that.setData({
        discount:discount,
        input_discount:""
      })
    }else{
      wx.showToast({
        title: '没填写或不能填写重复的标签名',
        icon:"none"
      })
    }
  },
    //添加规格
    add_spe(){
      let that = this
      if(that.data.input_spe){
        let spe = that.data.spe
        spe.push(that.data.input_spe)
        that.setData({
          spe:spe,
          input_spe:""
        })
      }else{
        wx.showToast({
          title: '请输入规格名或不能填写重复的商品规格',
          icon:"none"
        })
      }
    },
  // 上传商品的输入事件
  input_goodsMessage(e){
    let that = this
    let message = e.currentTarget.dataset.message
    if(message == 'pro_price'|| message == 'price'){
      that.setData({
        [message]:parseFloat((e.detail.value*1).toFixed(2)) //保留两位小数
      })
    }else{
      that.setData({
        [message]:e.detail.value
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
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
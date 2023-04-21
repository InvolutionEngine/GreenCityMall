const db =wx.cloud.database()
Page({
  data: {
    img:[],
    url:[],
  },
  sub_problem(){
    
    wx.switchTab({  
      url: '../user/user',
    })
    wx.showToast({
      title: '提交完成',
      icon:"none"
    })
    // var common_Interval = setInterval(()=>
    //   {
    //     wx.showLoading({
    //       title: '正在提交中',
    //     })
    //   }, 2000)
 
    // clearInterval(common_Interval);  
    // wx.hideLoading()
  },

  //计时
  
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
});
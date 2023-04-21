// index.js

const app = getApp()
const db= wx.cloud.database()

Page({
  data: {
    // currentIndex: 0,
   swiper:[],
   search_list:[],
   if_open_search_box:false,
   like:"",
   id:"",
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

  // handleChange: function (e) {
  //   this.setData({
  //     currentIndex: e.detail.current
  //   })
  // },

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
        // if(res.data.length !=0){
        //   that.setData({
        //     like:res.data[0].category,
           
        //   })
        //   console.log('like',like)
        // }      
      })
    }else{
      that.setData({
        search_list:[],
      })
    }
  },

  //
  onLoad:function(option){
    let that = this
    db.collection("swiper").get({
      success:res=>{
        console.log('swiper_success',res)
        that.setData({
          swiper:res.data
        })
      },fail:err=>{
          console.log('swiper_mistake',err)
        }
    })
    // ==============
    db.collection("shopping_products").get({
      success:res=>{
        console.log('shopping_products',res)
        that.setData({
          shopping_products:res.data
        })
      },fail:err=>{
          console.log('shopping_products',err)
        }
    })
  },
  
});

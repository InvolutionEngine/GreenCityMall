// pages/policy/policy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: '1',
    activeNames_crop: '1',
    activeNames_animal: '5',
    activeNames_processing: '2',
    select_detail:"地方民俗",

    activeNames_areaCustom:'1',
    activeNames_dietCulture:'1',
    activeNames_liveliHood:'1'
  },
  // 分类选择
  select_detail(e){
    let that =this
    let name = e.currentTarget.dataset.name
    that.setData({
      select_detail:name
    })
  },
  onChange_areaCustom(event) {
    this.setData({
      activeNames_areaCustom: event.detail,
    });
  },
  onChange_dietCulture(event) {
    this.setData({
      activeNames_dietCulture: event.detail,
    });
  },
  onChange_liveliHood(event) {
    this.setData({
      activeNames_liveliHood: event.detail,
    });
  },
// --------------------------------------------
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onChange_crop(event) {
    this.setData({
      activeNames_crop: event.detail,
    });
  },
  onChange_animal(event) {
    this.setData({
      activeNames_animal: event.detail,
    });
  },
  onChange_processing(event) {
    this.setData({
      activeNames_processing: event.detail,
    });
  },
  handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
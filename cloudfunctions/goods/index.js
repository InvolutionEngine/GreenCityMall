// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db =cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('shopping_products').add({
    data:{
      time:db.serverDate(),
      name:event.name,
      pro_price:event.pro_price,
      price:event.price,
      category:event.category,
      spe:event.spe,
      url:event.url,
      details_img:event.details_img,
      sales:event.sales,
      discount:event.discount,
    }
  })
}
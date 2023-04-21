// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if(event.method == 'get_goods'){
    return await db.collection('shopping_products').orderBy("time","desc").get()
  }else if(event.method == 'search'){
    return await db.collection('shopping_products').where({
      name: db.RegExp({
        regexp:event.name,
        options:'i',
      })
    }).orderBy("time","desc").get()
  }else if(event.method == 'to_category'){
    return await db.collection('shopping_products').where({
      category:event.category
    }).orderBy("time","desc").get()
  }else if(event.method == 'to_sales'){
    return await db.collection('shopping_products').doc(event.id).update({
      data:{
        sales:_.inc(event.num)
      }
    })
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db =cloud.database()
const _ =db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if(event.method == "cancel_order"){
    return await db.collection("order").doc(event.id).update({
      data:{
        type:"已结单",
        cancel_order_time:db.serverDate(),
      }
    })
  }else if(event.method == "receipt_order"){
    return await db.collection("order").doc(event.id).update({
      data:{
        type:"已结单",
        receipt_order_time:db.serverDate(),
      }
    })
  }else if(event.method == "get_data"){
    let now_data = new Date()
    const year = now_data.getFullYear()
    const month = now_data.getMonth()
    const day = now_data.getDate()
    //待发货
    const paid= await db.collection("order").where({type:"已付款"}).count()

    //已结单
    const closed= await db.collection("order").where({type:"已结单"}).count()

    //正在售后
    const saleing= await db.collection("order").where({type:"正在售后"}).count()

    //已售后
    const after_sales= await db.collection("order").where({type:"已售后"}).count()

    //本日订单数
    const day_Order_number= await db.collection("order").where({
      time:_.gte(new Date(year,month,day)),
    }).count()

    //本月订单数
    const month_Order_number= await db.collection("order").where({
      time:_.gte(new Date(year,month,1)),
    }).count()

    return {
      paid,
      closed,
      saleing,
      after_sales,
      day_Order_number,
      month_Order_number
    }
  }else if(event.method == "success_after_sales_service"){
    return await db.collection("order").doc(event.id).update({
      data:{
        type:"已售后",
        success_after_sales_service_time:db.serverDate(),
      }
    })
  }else if(event.method == "state_after_sales_service"){
    return await db.collection("order").doc(event.id).update({
      data:{
        type:"正在售后",
        state_after_sales_service_time:db.serverDate(),
      }
    })
  }
}

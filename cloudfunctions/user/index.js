// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db =cloud.database()
const _ =db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if(event.method == "user_enroll_businesses_upload"){
    return await db.collection("user").doc(event.id).update({
      data:{
        username:event.username,
        user_type:"商户",
        personal_message:event.personal_message,
      }
    })
  }else if(event.method == "user_enroll_subscriber_upload"){
    return await db.collection("order").doc(event.id).update({
      data:{
        nickName:event.nickName,
        user_type:"普通用户",
        personal_message:event.personal_message,
      }
    })
  }

}
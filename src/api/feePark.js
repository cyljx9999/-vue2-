import http from '@/utils/http'
//获取列表
export async function getListApi(param){
  return http.get("/api/feePark/list",param)
}
//查询车位列表
export async function getParkListApi(){
  return http.get("/api/parkList/listNoPage",null)
}
//新增
export async function addApi(param){
  return http.post("/api/feePark",param)
}
//编辑
export async function editApi(param){
  return http.put("/api/feePark",param)
}
//删除
export async function deleteApi(param){
  return http.delete("/api/feePark",param)
}
//缴费
export async function payApi(param){
  return http.post("/api/feePark/payPark",param)
}

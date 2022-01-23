import http from '@/utils/http'
//获取我的列表
export async function getMyListApi(param){
  return http.get("/api/userRepair/myList",param)
}
//获取维修列表
export async function getListApi(param){
  return http.get("/api/userRepair/list",param)
}
//新增维修
export async function addApi(param){
  return http.post("/api/userRepair",param)
}
//编辑
export async function editApi(param){
  return http.put("/api/userRepair",param)
}
//删除
export async function deleteApi(param){
  return http.delete("/api/userRepair",param)
}

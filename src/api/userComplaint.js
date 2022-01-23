import http from '@/utils/http'
//获取列表
export async function getListApi(param){
  return http.get("/api/userComplaint/list",param)
}
//新增
export async function addApi(param){
  return http.post("/api/userComplaint",param)
}
//编辑
export async function editApi(param){
  return http.put("/api/userComplaint",param)
}

//删除
export async function deleteApi(param){
  return http.delete("/api/userComplaint",param)
}

//获取我的投诉列表
export async function getMyListApi(param){
  return http.get("/api/userComplaint/myList",param)
}

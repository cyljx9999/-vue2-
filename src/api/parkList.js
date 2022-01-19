import http from '@/utils/http'
//获取列表
export async function getParkListApi(param){
  return http.get("/api/parkList/list",param)
}
//新增
export async function addParkListApi(param){
  return http.post("/api/parkList",param)
}
//编辑
export async function editParkListApi(param){
  return http.put("/api/parkList",param);
}
//删除
export async function deleteParkListApi(param){
  return http.delete("/api/parkList",param)
}

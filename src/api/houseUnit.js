import http from '@/utils/http'
//获取列表
export async function getListApi(param){
  return http.get("/api/houseUnit/list",param)
}
//获取栋数列表
export async function getBuildListApi(){
  return http.get("/api/houseBuild/unitList")
}
//新增
export async function addApi(param){
  return http.post("/api/houseUnit",param)
}
//编辑
export async function editApi(param){
  return http.put("/api/houseUnit",param)
}
//删除
export async function deleteApi(param){
  return http.delete("/api/houseUnit",param)
}

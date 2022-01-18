import http from '@/utils/http'
//查询列表
export async function getListApi(param){
  return http.get("/api/houseBuild/list",param)
}
//新增
export async function addApi(param){
  return http.post("/api/houseBuild",param)
}
//编辑
export async function editApi(param){
  return  http.put("/api/houseBuild",param)
}
//删除
export async function deleteApi(param){
  return  http.delete("/api/houseBuild",param)
}

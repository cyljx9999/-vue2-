import http from '@/utils/http'
//获取列表
export async function getListApi(param){
  return http.get("/api/sysNotice/list",param)
}
//新增
export async function addApi(param){
  return http.post("/api/sysNotice",param)
}
//编辑
export async function editApi(param){
  return http.put("/api/sysNotice",param)
}
//删除
export async function deleteApi(param){
  return http.delete("/api/sysNotice",param)
}

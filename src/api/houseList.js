import http from '@/utils/http'
//获取房屋列表
export async function getListApi(param){
  return http.get("/api/houseList/list",param)
}
//获取栋数列表
export async function getBuildListApi(){
  return http.get("/api/houseBuild/unitList")
}
//获取单元列表
export async function getUnitListByBuildId(param){
  return http.get("/api/houseUnit/getUnitListByBuildId",param)
}

//新增栋数
export async function addHouseApi(param){
  return http.post("/api/houseList",param)
}
//编辑
export async function editHouseApi(param){
  return http.put("/api/houseList",param);
}
//删除
export async function deleteHouseApi(param){
  return http.delete("/api/houseList",param)
}

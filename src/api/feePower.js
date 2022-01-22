import http from "@/utils/http";
// 根据单元id查房屋列表
export async function getHouseListByUnitId(param){
  return http.get("/api/houseList/getHouseListByUnitId",param)
}
//新增
export async function addPowerApi(param){
  return http.post("/api/feePower",param)
}
//查询电费列表
export async function getPowerListApi(param){
  return http.get("/api/feePower/list",param)
}
//编辑
export async function editPowerApi(param){
  return http.put("/api/feePower",param)
}
//删除
export async function deletePowerApi(param){
  return http.delete("/api/feePower",param)
}
//缴费
export async function payPowerApi(param){
  return http.post("/api/feePower/payPower",param)
}

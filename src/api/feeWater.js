import http from '@/utils/http'
//获取列表
export async function getListApi(param){
  return http.get("/api/feeWater/list",param)
}
//根据单元id查询房屋列表
export async function getHouseListByUnitId(param){
  return http.get("/api/houseList/getHouseListByUnitId",param)
}
//新增
export async function addApi(param){
  return http.post("/api/feeWater",param)
}
//编辑
export async function editApi(param){
  return http.put("/api/feeWater",param)
}
//删除
export async function deleteApi(param){
  return http.delete("/api/feeWater",param)
}
//缴费
export async function payApi(param){
  return http.post("/api/feeWater/payWater",param)
}

import http from '@/utils/http'
//新增
export async function addLiveUserApi(param){
  return http.post("/api/liveUser",param)
}
//获取角色列表
export async function getRoleListApi(){
  return http.get("/api/role/getList",null)
}
//业主列表
export async function getLiveUserListApi(param){
  return http.get("/api/liveUser/list",param)
}

//根据id查询用户
export async function getLiveUserByIdApi(param){
  return http.get("/api/liveUser/getUserById",param)
}
//编辑
export async function editLiveUserApi(param){
  return http.put("/api/liveUser",param)
}
//编辑
export async function deleteLiveUserApi(param){
  return http.delete("/api/liveUser",param)
}
//获取房屋列表
export async function getHouseListApi(param){
  return http.get("/api/houseList/list",param)
}
//分配房屋保存
export async function assignSaveApi(param){
  return http.post("/api/liveUser/assignSave",param)
}
//获取车位列表
export async function getParkListApi(param){
  return http.get("/api/parkList/list",param)
}
//分配车位保存
export async function assignParkSaveApi(param){
  return http.post("/api/liveUser/assignParkSave",param)
}

//退房
export async function returnHouseApi(param){
  return http.post("/api/liveUser/returnHouse",param)
}
//退车位
export async function returnParkApi(param){
  console.log(param);
  return http.post("/api/liveUser/returnPark",param)
}

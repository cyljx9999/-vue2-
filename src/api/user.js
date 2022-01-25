import request from '@/utils/request'
import http from "@/utils/http";
import {getUserId} from "@/utils/auth";

//获取用户列表
export async function getUserListApi(param) {
  return http.get("/api/user/list", param);
}
//新增用户列表
export async function addUserApi(param) {
  return http.post("/api/user", param);
}
//编辑员工
export async function editUserApi(param){
  return http.put("/api/user", param);
}
//删除员工
export async function deleteUserApi(param){
  return http.delete(`/api/user/${param.userId}`);
}

//员工登录
export async function login(param){
  return http.post("/api/user/login",param)
}

//员工登录
export async function getInfo(){
  let param = {
    userId:getUserId()
  };
  return http.get("/api/user/getInfo",param)
}

//根据用户id查询角色id
export async function getRoleByUserId(param){
  return http.get("/api/user/getRoleByUserId", param);
}
//分配角色保存
export async function assignSave(param){
  return http.post("/api/user/saveRole", param);
}

export async function getMenuList(){
  return http.get("/api/user/getMenuList")
}
//退出登录
export async function loginOutApi(){
  return http.post("/api/user/loginOut",null)
}
//修改密码
export async function resetPasswordApi(parm){
  return http.post("/api/user/resetPassword",parm)
}

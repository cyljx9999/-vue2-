import request from '@/utils/request'
import http from "@/utils/http";

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

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

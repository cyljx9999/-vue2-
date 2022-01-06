import http from "@/utils/http";

//查询角色列表
export async function getRoleListApi(param) {
  return http.get("/api/role/list",param)
}

//新增角色
export async function addRoleApi(param) {
  return http.post("/api/role",param)
}

//编辑角色
export async function editRoleApi(param) {
  return http.put("/api/role",param)
}

//删除角色
export async function deleteRoleApi(param) {
  return http.delete(`/api/role/${param.roleId}`)
}


import http from "@/utils/http";

export async function getRoleListApi(param) {
  return http.get("/api/role/list",param)
}

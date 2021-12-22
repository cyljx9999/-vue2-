import http from "@/utils/http";

export async function getRoleLisApi(param) {
  return http.get("/api/role/list",param)
}

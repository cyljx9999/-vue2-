import http from "@/utils/http";

//获取菜单列表
export async function getMenuListApi() {
    return http.get("/api/menu/list")
}

//新增菜单
export async function addMenuApi(param){
  return http.post("/api/menu", param);
}

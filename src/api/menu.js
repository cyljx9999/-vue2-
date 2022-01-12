import http from "@/utils/http";

//获取菜单列表
export async function getMenuListApi() {
    return http.get("/api/menu/list")
}

//新增菜单
export async function addMenuApi(param){
  return http.post("/api/menu", param);
}

//获取上级菜单数据
export async function getParentTreeApi(){
  return http.get("/api/menu/parent");
}
//编辑权限
export async function editMenuApi(param){
  return http.put("/api/menu",param)
}
//删除权限
export async function deleteMenuApi(param){
  return http.delete("/api/menu",param)
}

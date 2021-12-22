//对象的快速复制  不存在的key不复制
export default async function objCopy(obj1, obj2){
  Object.keys(obj2).forEach(key =>{
    obj1[key] = obj2[key]
  })
}

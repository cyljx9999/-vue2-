import http from '@/utils/http'
//我的电费列表
export async function getMyPowerFeeApi(param){
    return http.get("/api/feePower/getMyPowerFee",param)
}
//我的水费列表
export async function getMyWaterFeeApi(param){
    return http.get("/api/feeWater/getMyWaterFee",param)
}
//我的停车费列表
export async function getMyParkFeeApi(param){
    return http.get("/api/feePark/getMyParkFee",param)
}

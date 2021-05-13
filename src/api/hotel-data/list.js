import request from '@/utils/request'

// 获取页面饼图数据
export function getHotelPie(data) {
  return request({
    url: '/index/getHotelInfo',
    method: 'get',
    params: data
  })
}
// 获取页面区域表格数据
export function getHotelList(data) {
  return request({
    url: '/hotel/getByAddress',
    method: 'get',
    params: data
  })
}
//酒店pv,uv排名
export function getHotelByVolume(data) {
  return request({
    url: '/hotel/getByVolume',
    method: 'get',
    params: data
  })
}
//酒店订单排名
export function getHotelByOrder(data) {
  return request({
    url: '/hotel/getByOrder',
    method: 'get',
    params: data
  })
}
//酒店pv,uv排名
export function getRoomByVolume(data) {
  return request({
    url: '/hotel/getByVolumeRoom',
    method: 'get',
    params: data
  })
}
//房型订单排名
export function getRoomByOrder(data) {
  return request({
    url: '/hotel/getByOrderRoom',
    method: 'get',
    params: data
  })
}
//会员订单信息
export function getMemberOrder(data) {
  return request({
    url: '/member/getByRoomOrderNum',
    method: 'get',
    params: data
  })
}
//会员订单详情
export function getMemberOrderDetail(data) {
  return request({
    url: '/order/list',
    method: 'get',
    params: data
  })
}
import request from '@/utils/request'

// 获取页面数据
export function getOrderList(data) {
  return request({
    url: '/order/getSumData',
    method: 'get',
    params: data
  })
}
// 分时过期订单
export function getDivtimeList(data) {
    return request({
      url: '/divtime_expire/getSumData',
      method: 'get',
      params: data
    })
  }
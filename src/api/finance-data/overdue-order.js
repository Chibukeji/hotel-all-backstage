import request from '@/utils/request'

// 获取页面数据
export function getFincesPie(data) {
  return request({
    url: '/index/getDivtimeScoreExpireOrder',
    method: 'get',
    params: data
  })
}
// 获取页面表格数据
export function getFincesList(data) {
  return request({
    url: '/divtime_expire/list',
    method: 'get',
    params: data
  })
}
import request from '@/utils/request'

// 获取页面数据
export function appPieList(data) {
  return request({
    url: '/index/getAppInfo',
    method: 'get',
    params:data
  })
}
// 获取页面表格数据
export function appDownList(data) {
  return request({
    url: '/appdown/list',
    method: 'get',
    params:data
  })
}
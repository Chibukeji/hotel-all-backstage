import request from '@/utils/request'

// 获取页面数据
export function getActivePie(data) {
  return request({
    url: '/index/getActiveInfo',
    method: 'get',
    params: data
  })
}
// 获取页面表格数据
export function getActiveMemberList(data) {
  return request({
    url: '/active_member/list',
    method: 'get',
    params: data
  })
}
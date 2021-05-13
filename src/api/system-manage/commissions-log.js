import request from '@/utils/request'

// 列表
export function getCommissionsLogList(data) {
  return request({
    url: '/commissions_log/list',
    method: 'get',
    params: data
  })
}
// 删除
export function getCommissionsLogDel(data) {
  return request({
    url: '/commissions_log/delete',
    method: 'get',
    params: data
  })
}
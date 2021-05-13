import request from '@/utils/request'

// 列表
export function getCommissionsRateList(data) {
  return request({
    url: '/commissions_rate/list',
    method: 'get',
    params: data
  })
}
// 编辑
export function getCommissionsRateEdit(data) {
  return request({
    url: '/commissions_rate/update',
    method: 'post',
    data
  })
}
// 获取比例值
export function getCommissionsRateNum(data) {
  return request({
    url: '/commissions_rate/getConfig',
    method: 'get',
    params: data
  })
}

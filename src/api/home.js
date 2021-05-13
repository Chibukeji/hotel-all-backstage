import request from '@/utils/request'

export function logList(data) {
  return request({
    url: '/log/list',
    method: 'get',
    params:data
  })
}
//获取页面所有数据
export function allList(data) {
  return request({
    url: '/index/index',
    method: 'get',
    params:data
  })
}
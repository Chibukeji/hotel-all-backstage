import request from '@/utils/request'

// 列表
export function getConfigList(data) {
  return request({
    url: '/config/list',
    method: 'get',
    params: data
  })
}
//获取配置组信息
export function getConfigGroupsList(data) {
    return request({
      url: '/config/getGroups',
      method: 'get',
      params: data
    })
}
//修改配置信息
export function getConfigUpdate(data) {
    return request({
      url: '/config/updates',
      method: 'post',
      data
    })
}
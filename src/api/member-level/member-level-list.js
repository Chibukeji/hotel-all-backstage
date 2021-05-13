import request from '@/utils/request'

// 列表
export function getMemeberLevelList(data) {
  return request({
    url: '/member_level/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getMemeberLevelAdd(data) {
  return request({
    url: '/member_level/add',
    method: 'post',
    data
  })
}
// 编辑
export function getMemeberLevelEdit(data) {
  return request({
    url: '/member_level/update',
    method: 'post',
    data
  })
}
// 删除
export function getMemeberLevelDel(data) {
  return request({
    url: '/member_level/delete',
    method: 'get',
    params: data
  })
}
//会员权益列表
export function getMemeberRightList(data) {
  return request({
    url: '/member_level/getRightList',
    method: 'get',
    params: data
  })
}
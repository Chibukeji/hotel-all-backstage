import request from '@/utils/request'

// 列表
export function getMemberRightList(data) {
  return request({
    url: '/member_right/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getMemberRightAdd(data) {
  return request({
    url: '/member_right/add',
    method: 'post',
    data
  })
}
// 编辑
export function getMemberRightEdit(data) {
  return request({
    url: '/member_right/update',
    method: 'post',
    data
  })
}
// 删除
export function getMemberRightDel(data) {
  return request({
    url: '/member_right/delete',
    method: 'get',
    params: data
  })
}
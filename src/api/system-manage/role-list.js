import request from '@/utils/request'

// 后台角色列表
export function getBackstageRoleList(data) {
  return request({
    url: '/group/systemList',
    method: 'get',
    params: data
  })
}
// 酒店角色列表
export function getHotelRoleList(data) {
  return request({
    url: '/group/merchList',
    method: 'get',
    params: data
  })
}
// 服务商角色列表
export function getServiceRoleList(data) {
  return request({
    url: '/group/serviceList',
    method: 'get',
    params: data
  })
}
// 添加
export function getRoleAdd(data) {
  return request({
    url: '/group/add',
    method: 'post',
    data
  })
}
// 编辑
export function getRoleEdit(data) {
  return request({
    url: '/group/update',
    method: 'post',
    data
  })
}
// 删除
export function getRoleDel(data) {
  return request({
    url: '/group/delete',
    method: 'get',
    params:data
  })
}
//获取树形菜单
export function getTreeList(data) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: data
  })
}
//获取员工列表
export function hotelAccountList(data) {
  return request({
    url: '/group/hotelAccountList',
    method: 'get',
    params: data
  })
}
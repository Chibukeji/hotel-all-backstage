import request from '@/utils/request'

// 列表
export function getUserList(data) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getUserAdd(data) {
  return request({
    url: '/admin/add',
    method: 'post',
    data
  })
}
// 编辑
export function getUserEdit(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data
  })
}
// 删除
export function getUserDel(data) {
  return request({
    url: '/admin/delete',
    method: 'get',
    params: data
  })
}
//会员列表
export function getAllMemberList(data) {
  return request({
    url: '/member/list',
    method: 'get',
    params: data
  })
}
//会员列表(昵称带表情搜索)
export function getNickNameMemberList(data) {
  return request({
    url: '/member/getByNickName',
    method: 'get',
    params: data
  })
}
// 恢复软删除数据
export function recoverDelData(data) {
  return request({
    url: '/admin/restore',
    method: 'post',
    data
  })
}
//获取关联酒店列表
export function getAdminHotelList(data) {
  return request({
    url: '/admin/getAdminHotelList',
    method: 'get',
    params: data
  })
}
//设置关联酒店列表
export function setAdminHotel(data) {
  return request({
    url: '/admin/setAdminHotel',
    method: 'get',
    params: data
  })
}
//解除关联酒店列表
export function unsetAdminHotel(data) {
  return request({
    url: '/admin/unsetAdminHotel',
    method: 'get',
    params: data
  })
}
//获取酒店类型
export function getHotelCate(data) {
  return request({
    url: '/hotel/getHotelCate',
    method: 'get',
    params: data
  })
}
//获取酒店列表
export function getHotelList(data) {
  return request({
    url: '/hotel/list',
    method: 'get',
    params: data
  })
}
import request from '@/utils/request'

//获取会员数据
export function memberPieList(data) {
  return request({
    url: '/index/getMemberInfo',
    method: 'get',
    params:data
  })
}
//获取会员订单排名
export function memberOrderNum(data) {
  return request({
    url: '/member/getByOrderNum',
    method: 'get',
    params:data
  })
}
//获取会员列表
export function memberList(data) {
  return request({
    url: '/member/list',
    method: 'get',
    params:data
  })
}
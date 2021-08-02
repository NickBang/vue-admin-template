import request from '@/utils/request'

// 潜在客户列表
export function reviewPageList(data) {
  return request({
    url: '/claw/api/reviews/page_list',
    method: 'post',
    data
  })
}

// 视频关键词查询接⼝
export function videoWordList(data) {
  return request({
    url: '/claw/api/video_word/page_list',
    method: 'post',
    data
  })
}

// 添加视频关键词接⼝
export function addVideoWord(data) {
  return request({
    url: '/claw/api/video_word/add',
    method: 'post',
    data
  })
}

// 删除视频关键词接⼝
export function deleteVideoWord(data) {
  return request({
    url: '/claw/api/video_word/delete',
    method: 'post',
    data
  })
}
// 查询代理商下商户列表接⼝
export function userPageList(data) {
  return request({
    url: '/claw/api/user/page_list',
    method: 'post',
    data
  })
}
// 添加公司
export function addCompany(data) {
  return request({
    url: '/claw/api/system/company/add',
    method: 'post',
    data
  })
}
// 编辑公司
export function updateCompany(data) {
  return request({
    url: '/claw/api/system/company/update',
    method: 'post',
    data
  })
}
// 公司列表
export function getCompanyList(data) {
  return request({
    url: '/claw/api/system/company/page_list',
    method: 'post',
    data
  })
}
// 评论过滤词添加接口
export function addFilterWord(data) {
  return request({
    url: '/claw/api/system/filter_word/add',
    method: 'post',
    data
  })
}
// 评论过滤词删除接口
export function delFilterWord(data) {
  return request({
    url: '/claw/api/system/filter_word/delete',
    method: 'post',
    data
  })
}
// 评论过滤词查询接口
export function getFilterWord(data) {
  return request({
    url: '/claw/api/system/filter_word/page_list',
    method: 'post',
    data
  })
}
// 日志
export function getLog(data) {
  return request({
    url: '/claw/api/system/log/page_list',
    method: 'post',
    data
  })
}
// 获取套餐信息
export function getSystemInfo() {
  return request({
    url: '/claw/api/system/account',
    method: 'get'
  })
}
// 抓取定时任务频率设置接口
export function setSystemRate(data) {
  return request({
    url: '/claw/api/system/dict/rate_save',
    method: 'post',
    data
  })
}
// 抓取定时任务频率获取接口
export function getSystemRate(data) {
  return request({
    url: '/claw/api/system/dict/rate_query',
    method: 'post',
    data
  })
}
// 用户审核上线
export function onlineUser(data) {
  return request({
    url: '/claw/api/manager/user/online',
    method: 'post',
    data
  })
}
// 用户下线
export function offlineUser(data) {
  return request({
    url: '/claw/api/user/offline',
    method: 'post',
    data
  })
}
//评论⼈⼆维码⽣成接⼝
export function qrGenerate(data) {
  return request({
    url: '/claw/api/review/qr_generate',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
//root重置用户密码
export function resetPassword(data) {
  return request({
    url: '/claw/api/reset_password',
    method: 'post',
    data
  })
}
//获取 root || 代理商  下层列表
export function getVideoWordDownList(data) {
  return request({
    url: '/claw/api/video_word/using',
    method: 'post',
    data
  })
}

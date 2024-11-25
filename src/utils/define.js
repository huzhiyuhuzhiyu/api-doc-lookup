// 开发环境接口配置
const APIURl = 'http://zgt_zy.test.zgt.nbjuxuan.com/'  
module.exports = {
  APIURl: APIURl,
  timeout: process.env.NODE_ENV === 'development' ? 1000000 : 1000000,
  WebSocketUrl: process.env.NODE_ENV === 'development' ? APIURl.replace('http', 'ws') + '/api/message/websocket' : process.env.VUE_APP_BASE_WSS,
  comUploadUrl: process.env.VUE_APP_BASE_API + '/api/file/Uploader',
  comUrl: process.env.VUE_APP_BASE_API,
  // 本地文件预览
  filePreviewServer: process.env.NODE_ENV === 'development' ? 'http://localhost:30090' : process.env.VUE_APP_BASE_API + '/FileServer',
  // 大屏应用前端路径
  dataV: process.env.NODE_ENV === 'development' ? 'http://localhost:8100/DataV' : process.env.VUE_APP_BASE_API + '/DataV/',
  // 数据报表接口-java boot
  reportServer: process.env.NODE_ENV === 'development' ? 'https://localhost:30007' : process.env.VUE_APP_BASE_API + '/ReportServer',
  // reportServer:  'http://36.140.134.173:30004/ReportServer',

  // 数据报表接口-java cloud 
  // reportServer: process.env.NODE_ENV === 'development' ? 'http://localhost:30000' : process.env.VUE_APP_BASE_API,
  // 报表前端
  report: process.env.NODE_ENV === 'development' ? 'http://localhost:8200' : process.env.VUE_APP_BASE_API + '/Report',
  // report: process.env.NODE_ENV === 'http://36.140.134.65:40008/Report',
  // 视频播放=前端路径
  m3u8Url: 'http://36.140.26.171:40008',
}

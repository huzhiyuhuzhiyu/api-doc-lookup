const fs = require('fs');
const https = require('https');
const http = require('http');
const dayjs = require('dayjs');

// OpenAPI 地址（你这是 http 地址）
const OPENAPI_URL = 'http://doc.zgt.test.iiot.nbjuxuan.com/v3/api-docs';
const OUTPUT_FILE = './default_OpenAPI.json';

console.log('🔄 启动项目前自动更新 OpenAPI 接口文档...');

// 自动判断协议 + 自动处理证书/agent
const isHttps = OPENAPI_URL.startsWith('https');
const client = isHttps ? https : http;

const options = {};
// 只有 https 才需要忽略证书，http 不需要！
if (isHttps) {
  options.agent = new https.Agent({ rejectUnauthorized: false });
}

// 下载并更新
client.get(OPENAPI_URL, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync(OUTPUT_FILE, data, 'utf8');
    const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log('✅ OpenAPI 已更新：', OUTPUT_FILE);
    console.log('🕒 更新时间：', updateTime);
  });
}).on('error', (err) => {
  console.log('⚠️ 更新失败，使用旧版接口文档：', err.message);
});

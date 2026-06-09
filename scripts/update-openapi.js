const fs = require('fs');
const https = require('https');
const http = require('http');

// ====================== 按需修改 ======================
const OPENAPI_URL = 'http://your-api-host.com/v3/api-docs';
const OUTPUT_FILE = './default_OpenAPI.json';
// =====================================================

console.log('🔄 正在拉取 OpenAPI 接口文档...');

const agent = new https.Agent({ rejectUnauthorized: false });
const client = OPENAPI_URL.startsWith('https') ? https : http;

client.get(OPENAPI_URL, { agent }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync(OUTPUT_FILE, data, 'utf8');
        console.log(`✅ 已更新：${OUTPUT_FILE}`);
        console.log(`🕒 更新时间：${new Date().toLocaleString()}`);
    });
}).on('error', (err) => {
    console.error('❌ 拉取失败：', err.message);
    process.exit(1);
});

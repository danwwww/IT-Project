const OSS = require('ali-oss')

// 创建连接OSS的客户端
const client = new OSS({
    region: 'oss-cn-beijing', //你的OSS存储空间所在的地域
    bucket: 'xxxx',  //你的存储空间名
    accessKeyId: 'xxxxx', //你的AccessKeyID
    accessKeySecret: 'xxxxxx' //你的AccessKeySecret
})
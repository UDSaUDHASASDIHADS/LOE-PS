const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// 配置
const CONFIG = {
    uploadDir: path.join(__dirname, ''),
    maxFileSize: 10 * 1024 * 1024, // 10MB
    logToConsole: true
};

module.exports = {
    execute: async (req, res) => {
        try {
            // 确保上传目录存在
            await fs.mkdir(CONFIG.uploadDir, { recursive: true });

            // 收集POST数据
            let requestData = '';
            let currentSize = 0;

            req.on('data', (chunk) => {
                requestData += chunk;
                currentSize += chunk.length;

                // 限制最大请求大小
                if (currentSize > CONFIG.maxFileSize) {
                    const error = { status: 413, message: '请求体过大' };
                    res.statusCode = error.status;
                    res.end(JSON.stringify(error));
                    req.destroy();
                }
            });

            req.on('end', async () => {
                try {
                    // 生成唯一文件名
                    const timestamp = new Date().toISOString().replace(/:/g, '-');
                    const hash = crypto.createHash('md5')
                        .update(requestData + timestamp)
                        .digest('hex');
                    const fileName = `data.txt`;
                    const filePath = path.join(CONFIG.uploadDir, fileName);

                    // 保存为TXT文件
                    await fs.writeFile(filePath, requestData, 'utf8');

                    // 准备响应数据
                    const responseData = {
                        status: 0,
                        mailFlag: false
                    };

                    if (CONFIG.logToConsole) {
                        console.log(`[成功] 客户端数据保存 ${fileName} (大小: ${requestData.length} 字节)`);
                        console.log(`[详情] 请求方法: ${req.method}, URL: ${req.url}`);
                        console.log(`[详情] 保存路径: ${filePath}`);
                    }

                    // 返回响应
                    res.end(JSON.stringify(responseData));
                } catch (err) {
                    console.error('[错误] 处理请求时出错:', err);
                    res.statusCode = 500;
                    res.end(JSON.stringify({
                        status: 500,
                        mailFlag: false,
                        error: '服务器内部错误',
                        details: err.message
                    }));
                }
            });

        } catch (err) {
            console.error('[严重错误] 服务器错误:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: 500,
                mailFlag: false,
                error: '服务器内部错误',
                message: '处理请求时发生意外错误'
            }));
        }
    }
};
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { promisify } = require('util');

const gunzip = promisify(zlib.gunzip);

async function decodeBase64GzipFromDataFile(inputPath) {
    // 验证文件存在性
    if (!fs.existsSync(inputPath)) {
        throw new Error(`文件不存在: ${inputPath}`);
    }

    try {
        // 读取JSON文件内容
        const fileContent = await fs.promises.readFile(inputPath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        // 提取data字段（Base64编码的GZIP数据）
        const base64GzipData = jsonData.data;
        if (!base64GzipData) {
            throw new Error('JSON数据中缺少data字段');
        }

        // 转换Base64为Buffer
        const compressedBuffer = Buffer.from(base64GzipData, 'base64');

        // 验证GZIP头部
        const gzipHeader = compressedBuffer.slice(0, 2).toString('hex');
        if (gzipHeader !== '1f8b') {
            console.warn('警告: 数据不像是有效的GZIP格式 (缺少0x1f8b头部)');
        }

        // 解压缩数据
        const decompressedBuffer = await gunzip(compressedBuffer);

        // 尝试解析为JSON
        try {
            const originalData = JSON.parse(decompressedBuffer.toString('utf8'));
            return {
                originalFormat: 'json',
                data: originalData,
                originalSize: decompressedBuffer.length,
                compressedSize: compressedBuffer.length,
                compressionRatio: (compressedBuffer.length / decompressedBuffer.length * 100).toFixed(2) + '%'
            };
        } catch (jsonError) {
            // 如果不是有效的JSON，返回原始文本
            return {
                originalFormat: 'text',
                data: decompressedBuffer.toString('utf8'),
                originalSize: decompressedBuffer.length,
                compressedSize: compressedBuffer.length,
                compressionRatio: (compressedBuffer.length / decompressedBuffer.length * 100).toFixed(2) + '%'
            };
        }
    } catch (err) {
        throw new Error(`解码失败: ${err.message}`);
    }
}

// 使用示例
(async () => {
    try {
        const dataFilePath = path.join(__dirname, 'data.txt');
        const result = await decodeBase64GzipFromDataFile(dataFilePath);

        console.log('解码结果:', {
            originalFormat: result.originalFormat,
            originalSize: result.originalSize + ' bytes',
            compressedSize: result.compressedSize + ' bytes',
            compressionRatio: result.compressionRatio
        });

        // 保存解码结果
        const outputPath = path.join('packet.json');
        const outputContent = result.originalFormat === 'json'
            ? JSON.stringify(result.data, null, 2)
            : result.data;

        fs.writeFileSync(outputPath, outputContent);
        console.log(`解码结果已保存到: ${outputPath}`);
    } catch (err) {
        console.error('解码出错:', err.message);
    }
})();
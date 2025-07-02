const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

async function fileToGzipBase64(inputPath, outputPath) {
    // 验证输入文件存在性
    if (!fs.existsSync(inputPath)) {
        throw new Error(`文件不存在: ${inputPath}`);
    }

    // 创建临时压缩文件路径
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const tempGzPath = path.join(tempDir, `${path.basename(inputPath)}.gz`);

    try {
        // 流式处理：读取->压缩->写入临时文件
        await pipeline(
            fs.createReadStream(inputPath),
            zlib.createGzip({ level: 0 }),  // 最高压缩级别
            fs.createWriteStream(tempGzPath)
        );

        // 读取压缩文件并转换为Base64
        const compressedData = await fs.promises.readFile(tempGzPath);
        const base64String = compressedData.toString('base64');

        // 构建JSON对象并写入data.txt
        const jsonData = {
            data: base64String,
            version: "0_9137",
            secondOut: "100AZ",
            rebirth: 101,
            vip: true,
            otherr: "H4sIAI5hZGgA/x2KwQqAIBAF/+WdPShUh736JYsaBesaqERE/544l5nDvGA9M4svXRtoWw1C0dpzAjk7cYs1qHEHDbfnSjNqGl/0LCDtIgY3t3CAgO8HItQRRlQAAAA=",
            isExit: false,
            activityId: 12,
            activityData: "{\"rankValue\":0,\"rechargeRankValue\":0,\"taskRankValue\":0,\"otherRankValue\":0,\"data\":\"H4sIAI5hZGgA/7VUTW+jMBD9L3N2KwPdL24plapIUXe1JOoh6sHFk8SqsRE2yVZR/vuOMWTZQ9tD2xPjmfHjzfAeR9gXViLkGYObuxnkRzBdDTm/5Aw6ozzkF8mJwb3w2L5YPYTqLfqZ1q/3rBy+1iONeAOFOt7A8Nf2z88GDcq+i4qVaOUIS0djDwtbPaFcqA3OJeQp5zxlILReGX2uOMjXR9CTnoTB1vrfeCC8xb7H0vSg9GOLKPuoGmpDWNjOEDF+evgPfyncU8BPWMoyKkmrzHZMHsFTNI94IVw+N/SB0p55qa3vC53Du66+RmEg3wjtsC//au22RefGQcdz7DOd1gGy3WIA4WM8GTAmzsjxhnKFrRuNPgw5vOy8iSFzYv94p1PeVxPe6Yfw/iza2ZT2jwnt7MNp8/dQJsG4nW1mN6T0udnYYAVvvdBLVQcnf01o51o4H8/BAVGGwR5a1crfqo0fb6ooNOfJn0GpDGw33Ey+fUmy7zxNaRmuIYmvmjPkrnwhMTjDoSiJZCk0hjdFYasojmp0BYupbJJ6YL3nXBFNW4hqR/hrSnsrxXPZKDOaKpBSZkGDzg39W/Y4LICf/gJYbCrU1gQAAA==\"}",
            mailFlag: false,
            diamond: 999999873

        };

        await fs.promises.writeFile(outputPath, JSON.stringify(jsonData, null, 2));

        // 清理临时文件
        await fs.promises.unlink(tempGzPath);

        return {

            outputPath: outputPath
        };
    } catch (err) {
        // 确保清理临时文件
        if (fs.existsSync(tempGzPath)) {
            await fs.promises.unlink(tempGzPath).catch(() => {});
        }
        throw new Error(`处理失败: ${err.message}`);
    }
}

// 使用示例
(async () => {
    try {
        const inputFilePath = path.join(__dirname,'packet.json');
        const outputFilePath = path.join(__dirname, 'data.txt');

        const result = await fileToGzipBase64(inputFilePath, outputFilePath);

        console.log('处理完成:', {

            outputFile: result.outputPath
        });

        console.log(`Base64编码的压缩数据已保存到 ${result.outputPath} 的data字段中`);
    } catch (err) {
        console.error('处理出错:', err.message);
    }
})();
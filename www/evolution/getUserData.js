const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
//const {const: patch} = require("./patch");
module.exports = {
    execute: async (req, res) => {
        try {
            // 读取配置文件
            const configFilePath = path.join(__dirname, 'config.txt');
            const configContent = await fs.readFile(configFilePath, 'utf8');

            // 解析配置文件
            let configData;
            try {
                configData = JSON.parse(configContent);
            } catch (err) {
                console.error('配置文件解析失败:', err);
                res.statusCode = 500;
                return res.end(JSON.stringify({
                    error: 'Config Parse Error',
                    message: '配置文件格式错误，请检查config.txt'
                }));
            }

            // 读取数据文件
            const dataFilePath = path.join(__dirname, configData.dataFilePath || 'data.txt');
            const fileContent = await fs.readFile(dataFilePath, 'utf8');

            // 解析数据文件
            let parsedData;
            try {
                parsedData = JSON.parse(fileContent);
            } catch (err) {
                console.log('数据文件非JSON格式，使用原始文本:', err);
                parsedData = { data: fileContent };
            }

            // 提取data字段
            const dataField = parsedData.data !== undefined ? parsedData.data : parsedData;

            // 生成随机token
            const generateRandomToken = () => {
                const tokenLength = configData.tokenLength || 32;
                return crypto.randomBytes(tokenLength).toString('base64');
            };

            // 构建响应数据（从配置文件获取固定参数）
            const ret = {

                rebirth: configData.rebirth,
                isExit: configData.isExit,
                activityId: configData.activityId,
                activityData: configData.activityData,
                mailFlag: configData.mailFlag,
                diamond: configData.diamond,
                isVip: configData.isVip,
                isFirstBind: configData.isFirstBind,
                temp: configData.temp,
                data: dataField, // 保持动态从文件加载
                lastClientId: configData.lastClientId,
                creatVersion: configData.creatVersion,
                channelType: configData.channelType,
                version: configData.version,
                logLock: configData.logLock,
                name: configData.name,
                serverToken: generateRandomToken(), // 保持动态生成
                status: configData.status,
                playerId: configData.playerId
            };

            // 验证必要参数
            const requiredFields = [ 'rebirth', 'playerId'];
            for (const field of requiredFields) {
                if (ret[field] === undefined) {
                    console.error(`配置文件缺少必要字段: ${field}`);
                    res.statusCode = 500;
                    return res.end(JSON.stringify({
                        error: 'Config Missing Field',
                        message: `配置文件缺少必要字段: ${field}`
                    }));
                }
            }

            res.end(JSON.stringify(ret));
        } catch (err) {
            console.error('请求处理失败:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({
                error: 'Internal Server Error',
                message: '处理请求时发生错误'
            }));
        }
    }
};    
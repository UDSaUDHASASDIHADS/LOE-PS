

const fs = require("fs")
const http = require("http");
const c = require('./util/colog');
// 欢迎语配置
const WELCOME_MESSAGE = `
===================================
  LOE SERVER 已启动
  监听端口: 80
  当前时间: ${new Date().toLocaleString()}
===================================
`;

let requestListener = function (req, res) {
    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        return;
    }
    try {
        res.writeHead(200, { "Content-Type": "text/html" });
        console.log(c.colog(94, "[HTTP] REQ URL: %s"), req.url);
        const file = require("./www/" + req.url.split("?")[0]);
        file.execute(req, res);
      //  console.log(file)
        
        if (req.url != "/perf/dataUpload") {
            console.log("200 OK " + req.url);
        }
    }
    catch (e) {
        res.writeHead(200, { "Content-Type": "text/html" });
        console.log(c.colog(22, "[HTTP] Module %s wasnt found."), req.url);
        res.end('{"code":0}');
        
    }
}

http.createServer(requestListener).listen(80);
// 监听端口

    console.log(c.colog(96, WELCOME_MESSAGE));

    // 显示服务器信息
    const interfaces = require('os').networkInterfaces();
    console.log(c.colog(93, "可用网络接口:"));
    Object.keys(interfaces).forEach((iface) => {
        interfaces[iface].forEach((addr) => {
            if (addr.family === 'IPv4' && !addr.internal) {
                console.log(c.colog(93, `  http://${addr.address}:80`));
            }
        });
    });

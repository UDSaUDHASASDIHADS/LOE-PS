
//{"retcode":0,"message":"OK","data":{"id":"none","action":"ACTION_NONE","geetest":null}}
const timestamp = Date.now();  // 获取当前时间戳:ml-citation{ref="3" data="citationList"}
const dateObj = new Date(timestamp);  // 时间戳转Date对象:ml-citation{ref="6" data="citationList"}


module.exports = {
    execute(req, res){
    
        var ret ={"time":Date.now(),
            "status":0
        }
            console.log(ret)

  
console.log(dateObj)

        res.end(JSON.stringify(ret));
    }
}

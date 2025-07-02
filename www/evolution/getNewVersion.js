
//{"retcode":0,"message":"OK","data":{"id":"none","action":"ACTION_NONE","geetest":null}}
module.exports = {
    execute(req, res){
        var ret ={"updateNotice":"","advState":132,"version":"1.3.0","serverConfig":"","config":"","isUpdate":0,"status":0,"notice":""}
      //  console.log(ret)
        res.end(JSON.stringify(ret));
    }
}


//{"retcode":0,"message":"OK","data":{"id":"none","action":"ACTION_NONE","geetest":null}}
module.exports = {
    execute(req, res){
        var ret =
        {

    "status": 2
}
        console.log(ret)
        res.end(JSON.stringify(ret));
    }
}

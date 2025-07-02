
//{"retcode":0,"message":"OK","data":{"id":"none","action":"ACTION_NONE","geetest":null}}

module.exports = {
    execute(req, res){


        var ret =
  {"activityId":1,"status":0}
        console.log(ret)
        res.end(JSON.stringify(ret));
    }
}

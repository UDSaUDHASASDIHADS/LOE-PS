
//{"retcode":0,"message":"OK","data":{"id":"none","action":"ACTION_NONE","geetest":null}}
module.exports = {
    execute(req, res){
        var ret =
        {
    "instrPixelURL": "https://aax-events-cell02-cf.ap-southeast.aps.axp.amazon-adsystem.com/x/px/p/RGeq18eG8BO65aJ_B2EEsFwAAAGXxKZA5QUAAA-qBgBhcHNfbHR0bF9iaWQxICBhcHNfdHhuX2ltcDEgICAmXL90/",
    "errorMessage": "no results",
    "errorCode": "204",
    "status": "error"
}
        console.log(ret)
        res.end(JSON.stringify(ret));
    }
}

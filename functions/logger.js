var moment = require('moment')
const now = moment().format()
class myLogger {
    static userLogger(req, res, next){
        let log = {
            ip :req.ip,
            url :req.url,
            params: req.params,
            date :now
        }
       console.table(log)
        next()
      }

    }
    
    module.exports=  myLogger
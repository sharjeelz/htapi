var moment = require('moment')
const now = moment().format()
class myLogger {
  static userLogger(req, res, next) {
    let log = {
      ip: req.ip,
      url: req.url,
      params: req.params,
      date: now
    }
    console.table(log)
    next()
  }

  static SpamLogger(req, res, next, data) {

    let log = {
      ip: req.ip,
      user: req.body.user,
      data: JSON.stringify(data)
    }

    console.log(log);
    return res.status(400).json({
      message: "Not Allowed Words, your data may be logged for investigation"
    })

    
  }

}

module.exports = myLogger
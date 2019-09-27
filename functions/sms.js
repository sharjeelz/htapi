const axios = require("axios");
const sendSMS = (phone,message) => {
  axios({
    "method":"GET",
    "url":`http://pk.eocean.us/APIManagement/API/RequestAPI?user=AMANTECH&pwd=AAoW7ck9q%2b7QmvlnMvG%2fR3im5EFdnO4lFDQgpnPGZMhPD39hqXeL0VUuGrv%2bpAlL8Q%3d%3d&sender=AMANTECH%20CS&reciever=${phone}&msg-data=${message}&response=string`,
    })
    .then((response)=>{
      console.log('SMS Sent')
    })
    .catch((error)=>{
      console.log(error)
    })
}

module.exports= sendSMS;
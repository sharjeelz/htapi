const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'szubair01@gmail.com',
          pass: 'eotjuiqhdworoeav'
        }
      });
      
    async function sendEmail   (data){
        //return console.log(data);
        const mailOptions = {
            from: 'admin@healthtallk.com',
            to: 'sharjeel.zubair@virtualforce.io',
            subject: data.subject,
            html: data.body
            };
    try {
        
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
     
        console.log(error);
    }
      
        
    
}


module.exports= sendEmail;
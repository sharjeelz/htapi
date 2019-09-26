const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'szubair01@gmail.com',
          pass: 'eotjuiqhdworoeav'
        }
      });
      
    async function sendEmail   (data){
        const mailOptions = {
            from: 'admin@healthtallk.com',
            to: data.email,
            subject: data.subject,
            html: data.body
            };
    try {
        
        await transporter.sendMail(mailOptions);
        console.log('Email Sent')
        
    } catch (error) {
     
        console.log(error);
    }
      
        
    
}


module.exports= sendEmail;
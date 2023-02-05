import nodemailer from "nodemailer"


export const sentEmail=async(options,url,txt)=>{
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user:process.env. mailtrap_user, 
            pass: process.env.mailtrap_pass,  
        }
    });

    const message = {
        from: "emailreset@gmail.com",
        to: options.email,
        subject: txt,
        html:`<html>

        <head>
        
        <title>reset password</title>
        
        </head>
        
        <body>
        
        <p>Dear ${options.name}</p>
        
        <a href=${url}>reset</a>
        
        <p>Please let us know if you have any questions or concerns.</p>
        
        <p>Sincerely,<br>
        emailreset@gmail.com</p>
        
        </body>
        
        </html>`
       
    };
    await transporter.sendMail(message, function(error, info){ 
        if (error) { 
          console.log(error); 
        } else { 
          console.log('Email sent: ' + info.response); 
        } 
      });


}

export const successEmail=async(options,txt)=>{
  const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
          user:process.env. mailtrap_user, 
          pass:process.env. mailtrap_pass,  
      }
  });

  const message = {
      from: "emailreset@gmail.com",
      to: options.email,
      subject: txt,
      html:`<html>

      <head>
      
      <title>success Email</title>
      
      </head>
      
      <body>
      
      <p>Dear ${options.name}</p>
      
      
      <p>${txt}</p>
      
      <p>Sincerely,<br>
      emailreset@gmail.com</p>
      
      </body>
      
      </html>`
     
  };
  await transporter.sendMail(message, function(error, info){ 
      if (error) { 
        console.log(error); 
      } else { 
        console.log('Email sent: ' + info.response); 
      } 
    });


}
  

 
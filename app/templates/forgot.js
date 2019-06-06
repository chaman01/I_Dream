let forgotPasswordTemplate=async(weblink,name,link)=>{
    try{

      console.log(name,'sfgdufgdgfugdf===========ghfughfudg========')


    let forgotTemplate=`<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700" rel="stylesheet"><link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <title>Forgot Password!</title>
    <style type="text/css">
    @media only screen and (max-width: 600px)
    {
    body{font-size:12px !important}
    table{width:1000px}
    }
    </style>
    </head>
    <body style="font-family: \'Open Sans\', sans-serif; color:#000; font-size:15px;" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="width:100%;">
    <tr>
    <td align="center">
    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="max-width:600px; width:100%;">
    <tr>
    <td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="width:100%; background-color:#fff; border: 1px solid #ddd;padding: 0px 20px;">
    <tr style="float:left;width:100%;padding: 20px 0px;">
    <td style="float:left;width:100%;" align="center"> 
    <a style= "text-decoration: none;color: #0598FF;font-size: 41px; font-weight: 900;"href=${weblink}>Comvo debate</a>
    </td>
    </tr>
    <tr style="float:left;width:100%;padding-bottom:20px;">
    <td style="float:left;width:100%;" align="center">
    <h1 style="font-size: 30px;margin-top: 0px;margin-bottom: 0px;">FORGOT!</h1>
    <h1 style="font-size: 20px;margin-top: 0px;margin-bottom: 10px;">YOUR PASSWORD</h1>
    </td></tr><tr style="float:left;width:100%;padding-bottom:20px;">
    <td style="float:left;width:100%;" align="left;">
    <p style="line-height: 25px;font-size: 18px;margin-top: 0px;font-style: italic;">
    <strong>Hi ${name}!,</strong>
    </p><p style="line-height: 25px;font-size: 16px;margin-top: 0px;font-style: italic;"></p>
    <p style="line-height: 25px;font-size: 16px;margin-top: 0px;font-style: italic;">
    You recently requested to reset your password for account. Let\'s get you a new password. 
    Click the button blew to reset it.</p></td></tr>
    <tr style="float:left;width:100%;padding-bottom:40px;">
    <td style="float:left;width:100%;" align="center"> 
    <a style="background: #0598FF;color: #fff;text-decoration: none;border-radius: 40px;padding: 10px 30px;font-size: 20px;font-weight: 600;" href="${link}">RESET PASSWORD</a>
    </td></tr><tr style="float:left;width:100%;padding-bottom:20px;">
    <td style="float:left;width:100%;" align="left;">
    <p style="line-height: 25px;font-size: 16px;margin-bottom: 0px;margin-top: 0px;font-style: italic;">
    If you did not request a password reset, please ignore this email or reply to let us know. 
    This password reset is only valid for the next 30 minutes.
    </p></td></tr><tr style="float:left;width:100%;padding-bottom:20px;">
    <td style="float:left;width:100%;" align="left;"><p style="line-height: 25px;font-size: 16px;margin-top: 0px;font-style: italic;">Thanks,<br><strong>Combo debate team</strong></p></td></tr><tr style="background: #efefef;float:left;width:100%;padding: 20px 0px;">
    <td style="float:left;width:100%;font-size: 14px;color: #666;" align="center">
     <address>some address<br> +91 123456 <br> comvo@gmail.com </address>
     </td></tr></table></td></tr></table></td></tr></table></body></html>`;
     return forgotTemplate;
   }catch(err){
       console.log(err)
   }
}

module.exports=forgotPasswordTemplate;
const Config = require('../../config'),
    nodeMailerModule = require('nodemailer'),
    sesTransport = require('nodemailer-ses-transport');
request = require('request');

let appSid = "JcurCNofEM6HwJOQBb9Zm1PY8zM3d_"

const sendEmail = async (email, subject, content, attachmentPath = null) => {
    try {
        let transporter = await nodeMailerModule.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL, pass: process.env.PASSWORD } })
        let mailOptions = {};
        if (attachmentPath) {
            mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: subject,
                html: content,
                attachments: [
                    {
                        path: attachmentPath
                    }
                ]
            }

        } else {
            mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: subject,
                html: content
            }
        }

        return await transporter.sendMail(mailOptions)

    } catch (err) {
        console.log(err, '========sdsdsgd===================')
    }


};







async function unifonicIntegration(fullNumber, otp) {
    return new Promise((resolve, reject) => {
        let msg = "Thank you for signing up with -- your otp is: "+otp

        request({
            method: 'POST',
            url: 'https://private-anon-8b3946fa84-unifonic.apiary-mock.com/rest/Messages/Send',
            // url:'http://api.unifonic.com/rest/Messages/Send',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `AppSid=${appSid}&Recipient=${fullNumber}&Body=${msg}`
        }, function (error, response, body) {
            if(error){
                console.log("errrrrrrrrrrrrr  ", error)
                reject(error)
            }else{
                console.log('Status:', response.statusCode);
                console.log('Headers:', JSON.stringify(response.headers));
                console.log('Response:', body);
                resolve(body)
            }
        });
    });
}





module.exports = {
    sendEmail: sendEmail,
    unifonicIntegration: unifonicIntegration
};
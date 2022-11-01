const express = require('express')
const app = express()
require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const nodemailer = require('nodemailer')

const PORT = process.env.PORT || 4000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json("hello");
});

app.post('/send_mail', cors(), async (req,res) => {
        console.log(req.body);
        let {name, email, startDate, eventName, location, url} = req.body
        const transport = nodemailer.createTransport({
            // mailtrap.io
            // host: process.env.MAIL_HOST,
            // port: process.env.MAIL_PORT,
            // auth: {
            //     user: process.env.MAIL_USER,
            //     pass: process.env.MAIL_PASS
            // }

            // gmail
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        })
    
        await transport.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Event: ${eventName}`,
            html: `<div className="email" style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px; 
            ">
            <h2>${eventName}</h2>
            <p>Hi ${name}, this is a confirmation email to the event you RSVP </p>
            <p>${new Date(`'${startDate}'`).toDateString()}</p>
            <p>${location}</p>
            <p>Here is a <a href=${url}>link</a> to the event page</p>
        
            <p>All the best</p>
            </div>`
        }, (err) => {
            if(err){
                console.log('error', err);
            } else {
                console.log('success');
            }
        })
        res.send('Successfully sent')
    })

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

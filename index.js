import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to DortexAi API');
});

// send email
app.post('/send-email', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.warn(`name: ${name},\nemail: ${email},\nsubject: ${subject},\nmessage: ${message}`);
  console.warn(`APP_EMAIL: ${process.env.APP_EMAIL},\nAPP_PASSWORD: ${process.env.APP_PASSWORD},\nTO_EMAIL: ${process.env.TO_EMAIL}`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.APP_EMAIL,
        to: process.env.TO_EMAIL,
        subject: `${name} - ${subject}`,
        html: `Dear DortexAi Team,<br>
            <P>
                ${message}
            </P><br><br>
            <strong>Please respond to the user as soon as possible.</strong><br><br>
            Best Regards,<br>
            ${name}<br>
            ${email}<br>`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error.message);
            return res.status(500).send(error.message);
        } else {
            console.log(`Email sent: ${info.response}`);
            return res.status(200).send('Email sent successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
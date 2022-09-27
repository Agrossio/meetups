import nodemailer from 'nodemailer';

// Create a SMTP transporter object
let transporter = nodemailer.createTransport({
    host: smtp.gmail.com,
    port: 587,
    // secure: true,
    auth: {
        user: "crucep5@gmail.com",
        pass: "ggvkrwvelnheitur",
    }
});

export async function testEmail(user) {

    // Message object
    let message = {
        from: `no-reply Register - Cruce Bookings App<${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: `Test Complete!`,
        text: `Welcome ${user.name} (${user.email})!!
        This is a test`,
        html: `<p>Welcome ${user.name} (${user.email})!!</p>
        <p>This is a Test</p>
       
        <p> <strong>Cruce Bookings App</strong> </p>`
    };
    sendEmail(message)
}
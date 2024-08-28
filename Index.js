const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('./user');

cron.schedule('0 7 * * *', async () => {
  try {
    const today = new Date();
    const users = await User.find({
      dateOfBirth: {
        $eq: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    });

    if (users.length > 0) {
      console.log(`Found ${users.length} user(s) with birthdays today`);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      for (const user of users) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: `Happy Birthday, ${user.username}!`,
          text: `Dear ${user.username},\n\nWishing you a fantastic birthday filled with joy and love!\n\nBest Regards,\nYour Company`,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${user.email}: ${info.response}`);
        } catch (error) {
          console.error(`Error sending email to ${user.email}`, error);
        }
      }
    } else {
      console.log('No birthdays today');
    }
  } catch (error) {
    console.error('Error running cron job', error);
  }
});

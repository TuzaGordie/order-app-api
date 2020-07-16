"use strict";

const User = use('App/Models/User');
const nodemailer = require('nodemailer');

class UserController {

  async login({ request, auth }) {
      const { email, password } = request.all();
      const token = await auth.attempt(email, password);
      return token;
  }

  async register({ request }) {
    console.log('hey ninja!')
    //Create User
    const { email, password } = request.all();
    await User.create({
      email, 
      password,
    });

    //send notification email
    //Step 1 
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    //Step 2
    let mailOptions = {
      from: 'sophisticateddev@gmail.com',
      to: request.body.email,
      subject: 'Welcome',
      text: 'Order App Account Created'
    };

    //Step 3
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error', err);
      } else {
        console.log('Mail Sent!!!');
      }
    });

    return this.login(...arguments);
  }
}

module.exports = UserController;

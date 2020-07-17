"use strict";

const User = use('App/Models/User');
const nodemailer = require('nodemailer');
const send = require('gmail-send');

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
    let mailserverinfo = nodemailer.createTransport({
      service: 'gmail',
      host: 'stmp.gmail.com',
      port: '465',
      ssl: 'true',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    //Step 2
    let mailInfo = {
      from: 'sophisticateddev@gmail.com',
      to: request.body.email,
      subject: 'Welcome',
      text: 'Order App Account Created'
    };

    //Step 3
    mailserverinfo.sendMail(mailInfo, function(err, info) {
      if(err) {
        console.log('Error', err);
      } else {
        console.log('Mail Sent!!!' + info.response);
      }
    });

    return this.login(...arguments);
  }
}

module.exports = UserController;

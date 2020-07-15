"use strict";

const User = use("App/Models/User");
const nodemailer = require('nodemailer');
const nodemailMailgun = require('nodemailer-mailgun-transport');
// const Mail = use("Mail")

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
      password
    });

    //send notification email

    //Step 1 
    const auth =  {
      auth: {
        api_key: 'b01e7dbd36b7c5706affd5ee6eb67ae9-9a235412-3a4d629c',
        domain: 'replies.theoyagha.com'
      }
    };

    //Step 2 
    let transporter = nodemailer.createTransport( nodemailMailgun(auth) );

    //Step 3 
    const mailOptions = {
      from: 'Hey Ninja<sophisticateddev@gmail.com>',
      to: 'gordie2u@gmail.com',
      subject: 'Onboarding',
      text: 'Welcome Aboard'
    }

    // Step 4 
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error: ', err);
      } else {
        console.log('Email Sent!!!');
      }
    });

    return this.login(...arguments);
  }
}

module.exports = UserController;

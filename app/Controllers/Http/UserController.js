"use strict";

const User = use('App/Models/User');
const nodemailer = require('nodemailer');
const nodemailMailgun = require('nodemailer-mailgun-transport');

class UserController {

  async login({ request, auth }) {
      const { email, password } = request.all();
      const token = await auth.attempt(email, password);

    //send notification email
    //Step 1 
    const auth =  {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      }
    };

    //Step 2 
    let transporter = nodemailer.createTransport( nodemailMailgun(auth) );

    //Step 3 
    const mailOptions = {
      from: 'Gordie<sophisticateddev@gmail.com>',
      to: request.body.email,
      subject: 'Auth',
      text: 'You have successfully logged in to your Order app account'
    }

    // Step 4 
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error: ', err);
      } else {
        console.log('Email Sent!!!');
      }
    });

      return token;
      
  }

  async register({ request }) {
    //Create User
    const { email, password } = request.all();
    await User.create({
      email, 
      password,
    });

    //send notification email
    //Step 1 
    const auth =  {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      }
    };

    //Step 2 
    let transporter = nodemailer.createTransport( nodemailMailgun(auth) );

    //Step 3 
    const mailOptions = {
      from: 'Gordie<sophisticateddev@gmail.com>',
      to: request.body.email,
      subject: 'Onboarding',
      text: 'You have successfully created an Order app account'
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

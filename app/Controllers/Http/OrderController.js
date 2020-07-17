"use strict";

const Order = use('App/Models/Order');
const AuthorizationService = use('App/Services/AuthorizationService');
const nodemailer = require('nodemailer');
const nodemailMailgun = require('nodemailer-mailgun-transport');


class OrderController {
  async index({ auth }) {
    const user = await auth.getUser();
    return await user.orders().fetch();
  }

//////////////////////////
//////Create Order///////
///////////////////////

  async create({ auth, request }) {
    const user = await auth.getUser();
    const { name } = request.all();
    const order = new Order();
    order.fill({
      name,
    });
    await user.orders().save(order);

    //send notification email
    //Step 1 
    const auths =  {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      }
    };

    //Step 2 
    let transporter = nodemailer.createTransport( nodemailMailgun(auths) );

    //Step 3 
    const mailOptions = {
      from: 'Gordie<sophisticateddev@gmail.com>',
      to: user.email,
      subject: 'New Order',
      text: "You've successfully created a new order"
    }

    // Step 4 
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error: ', err);
      } else {
        console.log('Email Sent!!!');
      }
    });

    return order;
  }

//////////////////////////
//////Delete Order///////
///////////////////////

  async destroy({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    await order.delete();

    //send notification email
    //Step 1 
    const auths =  {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      }
    };

    //Step 2 
    let transporter = nodemailer.createTransport( nodemailMailgun(auths) );

    //Step 3 
    const mailOptions = {
      from: 'Gordie<sophisticateddev@gmail.com>',
      to: user.email,
      subject: 'Order Update',
      text: "You've successfully deleted an order"
    }

    // Step 4 
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error: ', err);
      } else {
        console.log('Email Sent!!!');
      }
    });

    return order;
  }

/////////////////////////
/////Update Order///////
///////////////////////

  async update({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    order.merge(request.only('name'));
    await order.save();

    //send notification email
    //Step 1 
    const auths =  {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      }
    };

    //Step 2 
    let transporter = nodemailer.createTransport( nodemailMailgun(auths) );

    //Step 3 
    const mailOptions = {
      from: 'Gordie<sophisticateddev@gmail.com>',
      to: user.email,
      subject: 'Order Update',
      text: "You've successfully Updated an order"
    }

    // Step 4 
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error: ', err);
      } else {
        console.log('Email Sent!!!');
      }
    });
    return order;
  }
}

module.exports = OrderController;

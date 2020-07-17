"use strict";

const Order = use("App/Models/Order");
const Item = use("App/Models/Item");
const AuthorizationService = use("App/Services/AuthorizationService");
const nodemailer = require('nodemailer');
const nodemailMailgun = require('nodemailer-mailgun-transport');

class ItemController {
  async index({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    return await order.items().fetch();
  }

/////////////////////////
//////Create Item///////
///////////////////////

  async create({ auth, request, params }) {
    const user = await auth.getUser();
    const { title } = request.all();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    const item = new Item();
    item.fill({
      title,
    });
    await order.items().save(item);

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
      subject: 'New Item',
      text: "You've successfully added a new item"
    }

    // Step 4 
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error: ', err);
      } else {
        console.log('Email Sent!!!');
      }
    });
    return item;
  }

//////////////////////////
//////Delete Item///////
///////////////////////

  async destroy({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const item = await Item.find(id);
    const order = await item.order().fetch();
    AuthorizationService.verifyPermission(order, user);
    await item.delete();

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
      subject: 'Item Update',
      text: "You've successfully deleted an item"
    }

    // Step 4 
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error: ', err);
      } else {
        console.log('Email Sent!!!');
      }
    });
    return item;
  }

/////////////////////////
//////Update Item///////
///////////////////////

  async update({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const item = await Item.find(id);
    const order = await item.order().fetch();
    AuthorizationService.verifyPermission(order, user);
    item.merge(request.only(["title"]));
    await item.save();

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
      subject: 'Item Update',
      text: "You've successfully Updated an item"
    }

    // Step 4 
    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
        console.log('Error: ', err);
      } else {
        console.log('Email Sent!!!');
      }
    });
    return item;
  }
}

module.exports = ItemController;

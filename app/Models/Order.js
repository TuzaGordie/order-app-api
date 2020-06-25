"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Order extends Model {
  user() {
    return this.belongsTo("App/Model/User");
  }

  items() {
    return this.hasMany("App/Models/Item");
  }
}

module.exports = Order;

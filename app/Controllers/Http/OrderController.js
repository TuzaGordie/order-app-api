"use strict";

const Order = use('App/Models/Order');

class OrderController {
  async index({ auth }) {
    const user = await auth.getUser();
    return await user.orders().fetch();
  }

  async create({ auth, request }) {
    const user = await auth.getUser();
    const { name } = request.all();
    const order = new Order();
    order.fill({
      name,
    });
    await user.orders().save(order);
    return order;
  }
}

module.exports = OrderController;

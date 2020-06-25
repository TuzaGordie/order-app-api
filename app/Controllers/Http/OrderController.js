"use strict";

const Order = use('App/Models/Order');
const AuthorizationService = use('App/Services/AuthorizationService')

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

  async destroy({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    await order.delete();
    return order;
  }

  async update({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    order.merge(request.only('name'));
    await order.save();
    return order;
  }
}

module.exports = OrderController;

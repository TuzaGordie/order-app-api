"use strict";

const Order = use("App/Models/Order");
const Item = use("App/Models/Item");
const AuthorizationService = use("App/Services/AuthorizationService");

class ItemController {

  async index({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    return await order.items().fetch();
  }

  async create({ auth, request, params }) {
    const user = await auth.getUser();
    const { name } = request.all();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    const item = new Item();
    item.fill({
      name,
    });
    await order.items().save(item);
    return item;
  }
}

module.exports = ItemController;

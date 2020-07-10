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
    const { title } = request.all();
    const { id } = params;
    const order = await Order.find(id);
    AuthorizationService.verifyPermission(order, user);
    const item = new Item();
    item.fill({
      title,
    });
    await order.items().save(item);
    return item;
  }

  async destroy({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const item = await Item.find(id);
    const order = await item.order().fetch();
    AuthorizationService.verifyPermission(order, user);
    await item.delete();
    return item;
  }

  async update({ auth, request, params }) {
    const user = await auth.getUser();
    const { id } = params;
    const item = await Item.find(id);
    const order = await item.order().fetch();
    AuthorizationService.verifyPermission(order, user);
    item.merge(request.only(["title"]));
    await item.save();
    return item;
  }
}

module.exports = ItemController;

'use strict'


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('auth/register', 'UserController.register'); 
  Route.post('auth/login', 'UserController.login');

  Route.get('orders', 'OrderController.index').middleware('auth');
  Route.post('orders', 'OrderController.create').middleware('auth');
  Route.delete('orders/:id', 'OrderController.destroy').middleware('auth');
  Route.patch('orders/:id', 'OrderController.update').middleware('auth');

  Route.get('orders/:id/items', 'ItemController.index').middleware('auth');
  Route.post('orders/:id/items', 'ItemController.create').middleware('auth');
})
  .prefix('api');


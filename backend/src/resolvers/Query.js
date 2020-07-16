const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');


const Query = {
// for this query we don't need authentication so we can direct it to our db right away if the query is exactly the same as the one in prisma with no filtering or authentication or custom logic, only pulling data from the db
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // Check if there is a current user ID
    if(!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },

  async users(parent, args, ctx, info) {
    // Check if they are logged in
    if(!ctx.request.userId) {
      throw new Error('Yu must be logged in!');
    }
    // Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // If they do, query all the users
    return ctx.db.query.users({}, info);
  },

  async order(parent, args, ctx, info) {
    // Make sure they are logged in
    if(!ctx.request.userId) {
      throw new Error('You aren\'t logged in!');
    }
    // Query the current order
    const order = await ctx.db.query.order({
      where: { id: args.id }
    }, info);
    // Check if they have the permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    // CHECK THIS BUG!! IF I PUT hasPermissionToSeeOrder in the if statement it show the error always
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if(!ownsOrder || !hasPermission) {
      throw new Error('You can\'t see this buddd');
    }
    // Return the order
    return order;
  },

  async orders(parent, args, ctx, info) {
    // Query the users id
    const { userId } = ctx.request;
    // Make sure they are logged in
    if(!userId) {
      throw new Error('You must be signed in!');
    }
    return ctx.db.query.orders({
      where: {
        user: { id: userId }
      }
    }, info)
  }
};

module.exports = Query;

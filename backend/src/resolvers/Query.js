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
};

module.exports = Query;

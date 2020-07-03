const { forwardTo } = require('prisma-binding');


const Query = {
// for this query we don't need authentication so we can direct it to our db right away if the query is exactly the same as the one in prisma with no filtering or authentication or custom logic, only pulling data from the db
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, context, info) {
    // Check if there is a current user ID
    if(!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  }
};

module.exports = Query;

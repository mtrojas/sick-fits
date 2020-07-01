const { forwardTo } = require('prisma-binding');


const Query = {
// for this query we don't need authentication so we can direct it to our db right away if the query is exactly the same as the one in prisma with no filtering or authentication or custom logic, only pulling data from the db
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db')
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }

};

module.exports = Query;

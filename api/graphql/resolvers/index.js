const plantResolvers = require("./plantsRslv");
const ownerResolvers = require("./ownersRslv");

module.exports = {
  Query: {
    ...plantResolvers.Query,
    ...ownerResolvers.Query,
  },
  Mutation: {
    ...plantResolvers.Mutation,
    ...ownerResolvers.Mutation,
  },
};

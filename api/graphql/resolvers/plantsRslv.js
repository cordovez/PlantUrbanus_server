const { GraphQLScalarType } = require("graphql");

// Models
const Plant = require("../../models/Plant");
// const Owner = require("../../models/Owner");
// const Propagation = require("../../models/Propagation");

module.exports = {
  // *** Query Resolvers *** //
  Query: {
    plants: async (obj, args, context) => {
      try {
        return await Plant.find();
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
    plant: async (obj, { id }, context) => {
      try {
        return await Plant.findById(id);
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
    //   owners: async (obj, args, context) => {
    //     try {
    //       return await Owner.find();
    //     } catch (error) {
    //       console.log(error.message);
    //       return [];
    //     }
    //   },
    //   owner: async (obj, { id }, context) => {
    //     try {
    //       return await Owner.findById(id);
    //     } catch (error) {
    //       console.log(error.message);
    //       return [];
    //     }
    //   },
  },

  // *** Mutation Resolvers *** //
  Mutation: {
    addPlant: async (obj, { newPlant }, { userId }) => {
      try {
        if (userId) {
          const createdPlant = await Plant.create({
            ...newPlant,
          });
          return [createdPlant];
        }
      } catch (error) {
        console.log("Plant was not added: ", error.message);
        return [];
      }
    },
    //   addOwner: (obj, { newOwner }, context) => {
    //     try {
    //       const createdOwner = Owner.create({
    //         ...newOwner,
    //       });
    //       return createdOwner;
    //     } catch (error) {
    //       console.log("Owner was not added: ", error.message);
    //       return [];
    //     }
    //   },
  },

  // *** Relational Objects Resolvers *** //
  Plant: {
    owner: (obj, args, context) => {
      // DB call:
      // temporary:
      const ownerIds = obj.owner.map((owner) => owner.id);
      const filteredOwners = owners.filter((owner) => {
        return ownerIds.includes(owner.id);
      });
      return filteredOwners;
    },
  },

  // *** New Custom types *** //
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Custom Date for purchased date",
    parseValue(value) {
      // the value from the client
      return new Date(value);
    },
    serialize(value) {
      // value sent to the client
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};

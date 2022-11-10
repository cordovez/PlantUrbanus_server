const { GraphQLScalarType } = require("graphql");

// Models
const Plant = require("../../models/Plant");
const Owner = require("../../models/Owner");
const Propagation = require("../../models/Propagation");

module.exports = {
  // *** Query Resolvers *** //
  Query: {
    plants: async (obj, args, context) => {
      try {
        const plants = await Plant.find().populate("owner");
        console.log(plants);
        return plants;
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
  },
  // *** Relational Objects Resolvers *** //
  Plant: {
    owner: (parent, args, context) => {
      return Owner.findById(parent.owner);
    },
  },

  // *** Mutation Resolvers *** //
  Mutation: {
    addPlant: async (_, { plantInput: { commonName, owner } }) => {
      // const findOwner = await Owner.findById({ owner });
      console.log(commonName);
      const newPlant = await Plant.create({
        commonName,
        owner,
      });

      return newPlant.populate("owner");

      // const res = await newPlant.save();
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

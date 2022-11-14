const { GraphQLScalarType } = require("graphql");

// Models
const Plant = require("../../models/Plant");
const Owner = require("../../models/Owner");
const Propagation = require("../../models/Propagation");
const { updateOne } = require("../../models/Owner");

// Mongo
const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = {
  // *** Query Resolvers *** //
  Query: {
    plants: async (obj, args, context) => {
      try {
        const plants = await Plant.find().populate("owner");
        return plants;
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
    plant: async (obj, { id }, context) => {
      try {
        const plant = await Plant.findById(id).populate({
          path: "owner",
          populate: { path: "plants" },
        });
        console.log(plant);
        return plant;
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
  },

  // *** Mutation Resolvers *** //
  Mutation: {
    addPlant: async (_, { plantInput: { commonName, owner } }) => {
      const newPlant = await Plant.create({
        commonName,
        owner,
      });
      async function run() {
        try {
          const database = client.db("PlantUrbanus");
          const owners = database.collection("owners");

          const whichOwner = { _id: newPlant.owner };
          const updateOwner = {
            $push: {
              plants: newPlant._id,
            },
          };
          const result = await owners.updateOne(whichOwner, updateOwner);
          console.log("whichOwner: ", whichOwner);
          console.log("result: ", result);
          console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} documents`
          );
        } finally {
          // await client.close();
        }
      }
      run().catch(console.dir);
      return newPlant.populate("owner");
    },
  },
  // *** Embedded Objects Resolvers *** //
  Plant: {
    owner: (parent, args, context) => {
      return Owner.findById(parent.owner);
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

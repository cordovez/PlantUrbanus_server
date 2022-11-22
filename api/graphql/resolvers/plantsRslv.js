const { GraphQLScalarType } = require("graphql");

// Models
const Plant = require("../../models/Plant");
const Owner = require("../../models/Owner");
const Propagation = require("../../models/Propagation");
const { updateOne } = require("../../models/Owner");

// Mongo
const { MongoClient } = require("mongodb");
const cloudinary = require("../../../config/cloudinary");
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
        return plant;
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
  },

  // *** Mutation Resolvers *** //
  Mutation: {
    addPlant: async (_, { plantInput: { commonName, owner, public_id } }) => {
      const newPlant = await Plant.create({
        commonName,
        owner,
        public_id,
      });
      // function to reference the 'owners' collection and ad the owner as a variable in the mutation
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
    async updatePlant(_, { updatePlantInput }, context, info) {
      const updatedPlant = await Plant.findByIdAndUpdate(
        updatePlantInput.id,
        updatePlantInput,
        { new: true }
      );
      return updatedPlant;
    },
    async deletePlant(_, { id }) {
      try {
        const plantExists = await Plant.findById(id);
        if (plantExists) {
          await Plant.findByIdAndRemove(id);
          return "Plant has been removed from the database";
        } else {
          return "Plant was not found in the database";
        }
      } catch (error) {
        console.log(error.message);
      }
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

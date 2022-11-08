require("dotenv").config();

// *** Apollo *** //

// Schema
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const { ApolloServer, gql } = require("apollo-server");

// const {
//   ApolloServerPluginLandingPageLocalDefault,
//   ApolloServerPluginLandingPageProductionDefault,
// } = require("@apollo/server/plugin/landingPage/default");

// let plugins = [];

// if (process.env.NODE_ENV === "production") {
//   plugins = [
//     ApolloServerPluginLandingPageProductionDefault({
//       embed: true,
//       graphRef: "myGraph@prod",
//     }),
//   ];
// } else {
//   plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })];
// }

const connectDB = require("../config/db");

const { cors } = require("cors");
const { Kind } = require("graphql/language");

// const typeDefs = gql`
//   scalar Date

//   enum Substrate {
//     SOIL
//     LECA
//     PON
//     AROID
//     MIX
//     SPHAGNUM
//   }

//   enum Method {
//     WATER
//     SOIL
//     AIR_LAYERING
//     TISSUE_CULTURE
//   }
//   # *** Database Object Types *** #
//   type Owner {
//     id: ID!
//     userName: String!
//     firstName: String
//     lastName: String
//     email: String
//   }

//   type Plant {
//     id: ID!
//     commonName: String
//     datePurchased: Date
//     substrate: Substrate
//     healthRating: Int
//     scientificName: String
//     familyName: String
//     public_id: String
//     owner: [Owner!]
//   }

//   type Cutting {
//     id: ID!
//     method: String!
//     commonName: String!
//     dateTaken: Date
//     scientificName: String
//     familyName: String
//     public_id: String
//     owner: [Owner!]
//   }

//   type Query {
//     plants: [Plant]
//     plant(id: ID): Plant
//     owner(id: ID): Owner
//     owners: [Owner]
//   }

//   # *** Mutations and their Inputs Types *** #
//   input OwnerInput {
//     userName: String!
//     email: String!
//   }

//   input PlantInput {
//     commonName: String!
//     public_id: String
//     owner: [OwnerInput]
//   }

//   type Mutation {
//     addPlant(newPlant: PlantInput): [Plant]
//     addOwner(newOwner: OwnerInput): Owner
//   }
// `;

// const resolvers = {
//   // *** Query Resolvers *** //
//   Query: {
//     plants: async (obj, args, context) => {
//       try {
//         return await Plant.find();
//       } catch (error) {
//         console.log(error.message);
//         return [];
//       }
//     },
//     plant: async (obj, { id }, context) => {
//       try {
//         return await Plant.findById(id);
//       } catch (error) {
//         console.log(error.message);
//         return [];
//       }
//     },
//     owners: async (obj, args, context) => {
//       try {
//         return await Owner.find();
//       } catch (error) {
//         console.log(error.message);
//         return [];
//       }
//     },
//     owner: async (obj, { id }, context) => {
//       try {
//         return await Owner.findById(id);
//       } catch (error) {
//         console.log(error.message);
//         return [];
//       }
//     },
//   },

//   // *** Mutation Resolvers *** //
//   Mutation: {
//     addPlant: async (obj, { newPlant }, { userId }) => {
//       try {
//         if (userId) {
//           const createdPlant = await Plant.create({
//             ...newPlant,
//           });
//           return [createdPlant];
//         }
//       } catch (error) {
//         console.log("Plant was not added: ", error.message);
//         return [];
//       }
//     },
//     addOwner: (obj, { newOwner }, context) => {
//       try {
//         const createdOwner = Owner.create({
//           ...newOwner,
//         });
//         return createdOwner;
//       } catch (error) {
//         console.log("Owner was not added: ", error.message);
//         return [];
//       }
//     },
//   },

//   // *** Relational Objects Resolvers *** //
//   Plant: {
//     owner: (obj, args, context) => {
//       // DB call:
//       // temporary:
//       const ownerIds = obj.owner.map((owner) => owner.id);
//       const filteredOwners = owners.filter((owner) => {
//         return ownerIds.includes(owner.id);
//       });
//       return filteredOwners;
//     },
//   },

//   // *** New Custom types *** //
//   Date: new GraphQLScalarType({
//     name: "Date",
//     description: "Custom Date for purchased date",
//     parseValue(value) {
//       // the value from the client
//       return new Date(value);
//     },
//     serialize(value) {
//       // value sent to the client
//       return value.getTime();
//     },
//     parseLiteral(ast) {
//       if (ast.kind === Kind.INT) {
//         return new Date(ast.value);
//       }
//       return null;
//     },
//   }),
// };

// *** Server *** //
const server = new ApolloServer({
  cache: "bounded",
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    const fakeUser = {
      userId: "someToken?",
    };
    return { ...fakeUser };
  },
  // plugins,
});
connectDB();
server.listen({ port: process.env.PORT || 5000 }).then(({ url }) => {
  console.log(`server started at ${url}`);
});

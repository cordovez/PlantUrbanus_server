const { GraphQLScalarType } = require("graphql");
const { ApolloErrors, ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const Owner = require("../../models/Owner");
const Plant = require("../../models/Plant");

module.exports = {
  // *** Query Resolvers *** //
  Query: {
    owners: async (obj, args, context) => {
      try {
        return await Owner.find().populate("plants");
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
    owner: async (obj, { id }, context) => {
      try {
        const owner = await Owner.findById(id).populate("plants");
        console.log(owner);
        return owner;
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
  },

  // *** Embedded Objects Resolvers *** //
  Owner: {
    plants: (parent, args) => {
      const match = Plant.find((plant) => {
        parent.id === plant.owner;
        return match.populate("plants");
      });
    },
  },

  // *** Mutation Resolvers *** //
  Mutation: {
    async registerOwner(_, { registerInput: { userName, email, password } }) {
      // see if email exists
      const userExists = await Owner.findOne({ email });

      // throw error if user exists
      if (userExists) {
        throw new ApolloError(
          "A user is already registered with the email " + email,
          "USER_ALREADY_EXISTS"
        );
      }
      //  encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);
      // Build mongoose Owner model

      const newOwner = new Owner({
        userName: userName,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      //  Create JST (attache to Owner Model)
      const token = jwt.sign(
        {
          user_id: newOwner._id,
          email,
        },
        process.env.SECRET_STRING,
        { expiresIn: "24h" }
      );

      newOwner.token = token;
      // Save user in mongoDB
      const res = await newOwner.save();

      return {
        id: res._id,
        ...res._doc,
      };
    },

    async loginOwner(_, { loginInput: { email, password } }) {
      // see if email exists
      const owner = await Owner.findOne({ email });

      // check if entered password equals encrypted password
      if (owner && (await bcrypt.compare(password, owner.password))) {
        // create NEW Token
        const token = jwt.sign(
          {
            user_id: owner._id,
            email,
          },
          process.env.SECRET_STRING,
          { expiresIn: "24h" }
        );
        //  attach token to Owner model that we found above
        owner.token = token;

        return {
          id: owner._id,
          ...owner._doc,
        };
      } else {
        // if user doesn't exist return error.
        throw new ApolloError("incorrect credentials", "INCORRECT_CREDENTIALS");
      }
    },

    async updateOwner(parent, { updateOwnerInput }, context, info) {
      const updatedOwner = await Owner.findByIdAndUpdate(
        updateOwnerInput.id,
        updateOwnerInput,
        { new: true }
      );
      return updatedOwner;
    },

    async deleteOwner(_, { id }) {
      try {
        const userExists = await Owner.findById(id);
        if (userExists) {
          await Owner.findByIdAndRemove(id);
          return "User has been removed from the database";
        }
        return "user is not in the database";
      } catch (error) {
        console.log(error.message);
      }
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

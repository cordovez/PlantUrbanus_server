const { gql } = require("apollo-server");

module.exports = gql`
  scalar Date

  enum Substrate {
    SOIL
    LECA
    PON
    AROID
    MIX
    SPHAGNUM
  }

  enum Method {
    WATER
    SOIL
    AIR_LAYERING
    TISSUE_CULTURE
  }
  # *** Database Object Types *** #
  input RegisterInput {
    userName: String
    email: String
    password: String
    confirmPassword: String
  }

  input LoginInput {
    email: String
    password: String
  }
  type Owner {
    id: ID!
    userName: String!
    firstName: String
    lastName: String
    email: String
    password: String
    token: String
  }

  type Plant {
    id: ID!
    commonName: String
    datePurchased: Date
    substrate: Substrate
    healthRating: Int
    scientificName: String
    familyName: String
    public_id: String
    owner: [Owner!]
  }

  type Cutting {
    id: ID!
    method: String!
    commonName: String!
    dateTaken: Date
    scientificName: String
    familyName: String
    public_id: String
    owner: [Owner!]
  }

  type Query {
    plants: [Plant]
    plant(id: ID!): Plant
    owner(id: ID!): Owner
    owners: [Owner]
  }

  # *** Mutations and their Inputs Types *** #
  input OwnerInput {
    userName: String!
    email: String!
  }

  input PlantInput {
    commonName: String!
    public_id: String
    owner: [OwnerInput]
  }

  type Mutation {
    addPlant(newPlant: PlantInput): [Plant]
    #addOwner(newOwner: OwnerInput): Owner
    registerOwner(registerInput: RegisterInput): Owner
    loginOwner(loginInput: LoginInput): Owner
  }
`;

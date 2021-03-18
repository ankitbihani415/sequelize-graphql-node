const { merge } = require('lodash');
const { bookTypeDef, bookResolvers } = require('./book.js');
const { userTypeDef, userResolvers } = require('./user.js');
const { attachmentTypeDef, attachmentResolvers } = require('./attachment.js');
const { gql } = require('apollo-server');

const Query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
  
  scalar Upload
  `;

var resolvers = {};

const typeDefs  = gql(`${Query}${bookTypeDef}${userTypeDef}${attachmentTypeDef}`)

resolvers = merge(resolvers, bookResolvers, userResolvers, attachmentResolvers )

module.exports = {typeDefs,resolvers}
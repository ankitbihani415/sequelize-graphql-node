const userTypeDef = `
    type User {
        phone: String,
        password: String
    }

    extend type Query {
        profile: String
    }

    extend type Mutation {
        login(phone:String!,password:String!): String
    }
`

const userResolvers = {
    Query: {
        profile: () => {
            debugger
            return 'profile fetch'
        },
    },
    Mutation:{
        login : (_ , args ) => {
            debugger
            return `${args.phone} and ${args.password} enter in logged in mutation`
        }
    }
};

module.exports = {userTypeDef, userResolvers}
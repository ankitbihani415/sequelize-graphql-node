const book = require("../postgres/models/book");

const bookTypeDef = `
    type Book {
        id:ID!
        title: String
        author: String
        publication:String
        is_published:Boolean
        cover_image:Attachment
    }
    
    extend type Query {
        books: [Book]
        book(id:ID!): Book
    }

    extend type Mutation {
        addBook(book: AddBookInput): Book
        updateBook(book: UpdateBookInput): String
        deleteBook(id:ID!):String
    }

    input AddBookInput {
        title:String!
        author:String!
        publication:String!
        is_published:Boolean!
    }

    input UpdateBookInput {
        id:ID!
        title:String
        author:String
        publication:String
    }
`;

const bookResolvers = {
    Query: {
        books: async (_ , args, {models}) => {
            books = await models.Book.findAll()
            return books
        },
        book: async (_ , args, {models}) => {
            var book = await models.Book.findByPk(args.id)
            // var attach = await models.Attachment.findByPk(1)
            // book.cover_image = attach
            book.cover_image = await book.getAttachment()
            return book
        }
    },
    Mutation: {
        addBook : async(_ , args,{models}) => {
            book = {
                title: args.book.title,
                author: args.book.author,
                publication:args.book.publication,
                is_published:args.book.is_published
            }
            book = await models.Book.create(book)
            return book
        },
        updateBook : async( _ , args, {models}) => {
            var update = {}
            if(args.book.title){
                update.title =  args.book.title
            }
            if(args.book.author){
                update.author =  args.book.author
            }
            if(args.book.publication){
                update.publication = args.book.publication
            }
            if(args.book.is_published){
                update.is_published = args.book.is_published
            }
            book = await models.Book.update(update, {
                where: {
                    id: args.book.id
                }
            });
            if(book[0]){
                return "book update"
            }
            else{
                return "book not found"
            }
        },
        deleteBook: async( _ , args, {models}) => {
            book = await models.Book.destroy({
                where:{
                    id:args.id
                }
            })
            // debugger
            if(book){
                return "book deleted"
            }
            else{
                return "book not found"
            }
        },
    }
};

module.exports = {bookTypeDef, bookResolvers}
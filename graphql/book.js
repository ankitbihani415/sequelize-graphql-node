const book = require("../postgres/models/book");
const {
    storeFS
} = require("./attachment")
var fs = require('fs');

const bookTypeDef = `
    enum BOOK_CAT_ENUM {
        DRAMA
        PROGRAMMING
        FINANCIAL
        ACCOUNT
    },
    type Book {
        id:ID!
        title: String
        author: String
        publication:String
        is_published:Boolean
        cover_image:Attachment
        book_cat: BOOK_CAT_ENUM
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
        book_cat: BOOK_CAT_ENUM
    }

    input UpdateBookInput {
        id:ID!
        title:String
        author:String
        publication:String
        book_cat: BOOK_CAT_ENUM
    }
`;

const bookResolvers = {
    Query: {
        books: async (_, args, {
            models
        }) => {
            books = await models.Book.findAll({
                // attributes: [
                //     [models.sequelize.fn('DISTINCT', models.sequelize.col('Book.id')), 'Book.id'],
                // ].concat(Object.keys(models.Book.rawAttributes)),
                include: {
                    model: models.Attachment,
                    as: 'cover_image'
                } //required:true for inner join
            })
            return books
        },
        book: async (_, args, {
            models
        }) => {
            var book = await models.Book.findByPk(args.id, {
                include: {
                    model: models.Attachment,
                    as: 'cover_image'
                }
            })
            // var attach = await models.Attachment.findByPk(1)
            // book.cover_image = attach
            // book.cover_image = await book.getAttachment()
            return book
        }
    },
    Mutation: {
        addBook: async (_, args, {
            models
        }) => {
            var book = {
                title: args.book.title,
                author: args.book.author,
                publication: args.book.publication,
                is_published: args.book.is_published
            }
            if (args.book.book_cat) {
                book.book_cat = args.book.book_cat
            }
            book = await models.Book.create(book)
            if (args.avatar) {
                const {
                    filename,
                    mimetype,
                    createReadStream
                } = await args.avatar.file;
                const stream = createReadStream();
                const pathObj = await storeFS({
                    stream,
                    filename
                });
                const fileLocation = pathObj.path;
                const attachment = await models.Attachment.create({
                    attachment_path: fileLocation,
                    attachment_type: 'book_cover_photo',
                    parent_id: book.id
                })
            }
            return book
        },
        updateBook: async (_, args, {
            models
        }) => {
            var update = {}
            if (args.book.title) {
                update.title = args.book.title
            }
            if (args.book.author) {
                update.author = args.book.author
            }
            if (args.book.publication) {
                update.publication = args.book.publication
            }
            if (args.book.is_published) {
                update.is_published = args.book.is_published
            }
            if (args.book.book_cat) {
                update.book_cat = args.book.book_cat
            }
            bookUpdate = await models.Book.update(update, {
                where: {
                    id: args.book.id
                }
            });
            if (bookUpdate[0]) {
                return "book update"
            } else {
                return "book not found"
            }
        },
        deleteBook: async (_, args, {
            models
        }) => {
            bookDelete = await models.Book.destroy({
                where: {
                    id: args.id
                }
            })
            // debugger
            if (bookDelete) {
                return "book deleted"
            } else {
                return "book not found"
            }
        },
    },
    BOOK_CAT_ENUM: {
        DRAMA: "drama",
        PROGRAMMING: "programming",
        FINANCIAL: "financial",
        ACCOUNT: "account",
    },
};

module.exports = {
    bookTypeDef,
    bookResolvers
}
const { GraphQLError, subscribe } = require("graphql");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // if (!args.genre) return books;
      // return books.filter((book) => book.genres.includes(args.genre));
      if (!args.genre) return Book.find({});

      return Book.find({ genres: args.genre });
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: async (author) => {
      const books = await Book.find({ author: author._id });
      return books.length;
    },
  },
  Book: {
    author: async (book) => {
      return Author.findById(book.author);
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      // const newBook = { ...args, id: uuid() };

      // if (!authors.find((a) => a.name === newBook.author)) {
      //   authors = authors.concat({ name: newBook.author, id: uuid() });
      // }

      // books = books.concat(newBook);
      // return newBook;
      const findAuthor = async (name) => await Author.findOne({ name });

      const book = new Book({ ...args });

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (!(await findAuthor(args.author))) {
        const newAuthor = new Author({ name: args.author });
        try {
          await newAuthor.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }

      book.author = await findAuthor(args.author);

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      // const author = authors.findOne((author) => author.name === args.name);
      // if (!author) return null;

      // const updatedAuthor = { ...author, born: args.setBornTo };
      // authors = authors.map((a) =>
      //   a.id === updatedAuthor.id ? updatedAuthor : a
      // );
      // return updatedAuthor;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;

      author.born = args.setBornTo;

      return author.save();
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_UESR_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;

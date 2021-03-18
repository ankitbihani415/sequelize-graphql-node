'use strict';
const {
  Model
} = require('sequelize');
// const models = require('./index')
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.hasOne(models.Attachment, {
        foreignKey: 'parent_id'
      });
    }
  };
  Book.init({
    title: {
      type:DataTypes.STRING,
      allowNull:false
    },
    author: DataTypes.STRING,
    publication: DataTypes.STRING,
    is_published: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};
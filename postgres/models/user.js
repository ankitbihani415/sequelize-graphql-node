'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    phone: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	first_name: {
		type: DataTypes.STRING,
	},
	last_name: {
		type: DataTypes.STRING,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	phone_verification_code: {
		type: DataTypes.INTEGER
	},
	phone_verified_at: {
		type: DataTypes.DATE
	}
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// define association here
			User.hasMany(
				models.Pin, {
					foreignKey: 'authorId',
					onDelete: 'CASCADE',
					hooks: true
				}
			)
			User.hasMany(
				models.Board, {
					foreignKey: 'authorId',
					onDelete: 'CASCADE',
					hooks: true
				}
			)
		}
	};

	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					len: [1, 30],
					isNotEmail(value) {
						if (Validator.isEmail(value)) {
							throw new Error("Cannot be an email.");
						}
					}
				}
			},
			displayName: {
				type: DataTypes.STRING,
				validate: {
					len: [1, 30]
				}
			},
			firstName: {
				type: DataTypes.STRING,
				validate: {
					len: [1, 48]
				}
			},
			lastName: {
				type: DataTypes.STRING,
				validate: {
					len: [1, 48]
				}
			},
			bio: {
				type: DataTypes.STRING,
				validate: {
					len: [1, 512]
				}
			},
			icon: {
				type: DataTypes.STRING,
				validate: {
					len: [1, 128]
				}
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					len: [3, 256],
					isEmail: true
				}
			},
			hashedPassword: {
				type: DataTypes.STRING.BINARY,
				allowNull: false,
				validate: {
					len: [60, 60]
				}
			}
		}, {
			sequelize,
			modelName: 'User',
			defaultScope: {
				attributes: {
					exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
				}
			}
		}
	);
	return User;
};
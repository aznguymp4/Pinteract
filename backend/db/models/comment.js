'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Comment.belongsTo(
				models.User, {
					foreignKey: 'authorId',
				}
			)
			Comment.belongsTo(
				models.Pin, {
					foreignKey: 'pinId'
				}
			)
		}
	}
	Comment.init({
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		pinId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 512]
			}
		}
	}, {
		sequelize,
		modelName: 'Comment',
	});
	return Comment;
};
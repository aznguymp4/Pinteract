'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Board extends Model {
		static associate(models) {
			Board.belongsTo(
				models.User, {
					foreignKey: 'authorId',
					as: 'Author'
				}
			)
			Board.belongsToMany(
				models.Pin,
				{
					through: models.BoardPin,
					foreignKey: 'boardId',
					otherKey: 'pinId'
				}
			);
		}
	}
	Board.init({
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		coverPin: DataTypes.INTEGER,
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 64]
			}
		},
		desc: {
			type: DataTypes.STRING,
			validate: {
				len: [1, 256]
			}
		},
		public: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'Board',
	});
	return Board;
};
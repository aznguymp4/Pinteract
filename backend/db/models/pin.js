'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Pin extends Model {
		static associate(models) {
			Pin.belongsTo(
				models.User, {
					foreignKey: 'authorId',
					as: 'Author'
				}
			)
			Pin.belongsToMany(
				models.Board, {
					through: models.BoardPin,
					foreignKey: 'pinId',
					otherKey: 'boardId'
				}
			)
			Pin.hasMany(
				models.Comment, {
					foreignKey: 'pinId',
					onDelete: 'CASCADE',
					hooks: true
				}
			)
			Pin.hasMany(
				models.Favorite, {
					foreignKey: 'pinId',
					onDelete: 'CASCADE',
					hooks: true
				}
			)
		}
	}
	
	Pin.init({
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		img: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 256],
				isUrl: true
			}
		},
		title: {
			type: DataTypes.STRING,
			validate: {
				len: [1, 128]
			}
		},
		desc: {
			type: DataTypes.STRING,
			validate: {
				len: [1, 800]
			}
		},
		public: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		canComment: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'Pin'
	});
	return Pin;
};
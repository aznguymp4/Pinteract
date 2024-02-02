'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Favorite } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA;  // define your schema in options object
}

const seed = [
	{
		authorId: 1,
		pinId: 1
	},
	{
		authorId: 2,
		pinId: 1
	},
]

module.exports = {
	async up (queryInterface, Sequelize) {
		await Favorite.bulkCreate(seed)
	},

	async down (queryInterface, Sequelize) {
		options.tableName = 'Favorites';
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(options, {
			pinId: { [Op.in]: seed.map(b=>b.pinId) }
		}, {});
	}
};

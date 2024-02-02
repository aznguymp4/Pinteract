'use strict';

/** @type {import('sequelize-cli').Migration} */
const { BoardPin } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA;  // define your schema in options object
}

const seed = [
	{
		boardId: 1,
		pinId: 2
	},
	{
		boardId: 2,
		pinId: 3
	},
]

module.exports = {
	async up (queryInterface, Sequelize) {
		await BoardPin.bulkCreate(seed)
	},

	async down (queryInterface, Sequelize) {
		options.tableName = 'BoardPins';
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(options, {
			boardId: { [Op.in]: seed.map(b=>b.boardId) }
		}, {});
	}
};

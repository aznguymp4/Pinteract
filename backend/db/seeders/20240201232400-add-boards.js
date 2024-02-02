'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Board } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA;  // define your schema in options object
}

const seed = [
	{
		authorId: 1,
		title: 'Animals',
		desc: 'This is a board about animals',
		public: true
	},
	{
		authorId: 2,
		title: 'Don',
		desc: 'This is a board about don chan',
		public: true
	},
]

module.exports = {
	async up (queryInterface, Sequelize) {
		await Board.bulkCreate(seed)
	},

	async down (queryInterface, Sequelize) {
		options.tableName = 'Boards';
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(options, {
			title: { [Op.in]: seed.map(b=>b.title) }
		}, {});
	}
};

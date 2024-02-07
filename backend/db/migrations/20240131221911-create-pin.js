'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Pins', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			authorId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			img: {
				type: Sequelize.STRING(256)
			},
			title: {
				type: Sequelize.STRING(128)
			},
			desc: {
				type: Sequelize.STRING(800)
			},
			public: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			canComment: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			}
		}, options);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Pins";
		return queryInterface.dropTable(options);
	}
};
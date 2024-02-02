'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Comments', {
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
			pinId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			content: {
				type: Sequelize.STRING(512),
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
		options.tableName = "Comments";
		return queryInterface.dropTable(options);
	}
};
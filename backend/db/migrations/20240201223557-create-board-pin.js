'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BoardPins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pinId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Pins' },
        onDelete: 'CASCADE'
      },
      boardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Boards' },
        onDelete: 'CASCADE'
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
		options.tableName = "BoardPins";
		return queryInterface.dropTable(options);
  }
};
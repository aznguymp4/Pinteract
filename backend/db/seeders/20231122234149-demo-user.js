'use strict';

/** @type {import('sequelize-cli').Migration} */
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
	options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
	async up (queryInterface, Sequelize) {
		await User.bulkCreate([
			{
				email: 'demo@aa.io',
				username: 'Demo-lition',
				displayName: 'Demo!!',
				firstName: 'Demo',
				lastName: 'Lition',
				bio: 'Hi! My name is Demo and I am a test user for this app.',
				icon: 'https://app-academy-projects.s3.us-west-2.amazonaws.com/pinteract-1-1721955439092.jpg',
				hashedPassword: bcrypt.hashSync('password')
			},
			{
				email: 'user1@aa.io',
				username: 'FakeUser1',
				firstName: 'Fake',
				lastName: 'User',
				hashedPassword: bcrypt.hashSync('password2')
			},
			{
				email: 'user2@aa.io',
				username: 'FakeUser2',
				firstName: 'User',
				lastName: 'Fake',
				hashedPassword: bcrypt.hashSync('password3')
			}
		], { validate: true });
	},

	async down (queryInterface, Sequelize) {
		options.tableName = 'Users';
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(options, {
			username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
		}, {});
	}
};
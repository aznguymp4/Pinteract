'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Comment } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const seed = [
  {
    authorId: 3,
    pinId: 1,
    content: 'roblox'
  },
  {
    authorId: 2,
    pinId: 3,
    content: 'drummy :D'
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await Comment.bulkCreate(seed)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Comments';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      content: { [Op.in]: seed.map(c=>c.content) }
    }, {});
  }
};

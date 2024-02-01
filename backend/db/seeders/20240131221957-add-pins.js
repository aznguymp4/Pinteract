'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Pin } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const seed = [
  {
    authorId: 1,
    img: 'https://cdn.discordapp.com/emojis/671540624620781569.png',
    public: true,
    canComment: true
  },
  {
    authorId: 2,
    img: 'https://cdn.discordapp.com/emojis/884831015925854248.png',
    title: 'cute duck',
    desc: 'Quack lol',
    public: true,
    canComment: false
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await Pin.bulkCreate(seed)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Pins';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      img: { [Op.in]: seed.map(p=>p.img) }
    }, {});
  }
};

const { Sequelize, Op } = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  recipientHasRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Message.updateUnreads = async function (senderId, lastReadId) {

  const messages = await Message.update({
    recipientHasRead: true,
  }, {
    where: {
      id: {
        [Op.gt]: lastReadId
      },
      senderId,
    }
  })
  
  return messages;
}

module.exports = Message;

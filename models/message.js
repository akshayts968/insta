const User=require("./user");
const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  

  const ConversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
  });
  
  const Message = mongoose.model('Message', MessageSchema);
  const Conversation = mongoose.model('Conversation', ConversationSchema);
  module.exports = {
    Message,
    Conversation
  };
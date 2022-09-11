const mongoose = require('mongoose');

// テーブル構造、カラム構造を定義する
const postSchema = new mongoose.Schema(
  {
    // 投稿したユーザーID
    userId: {
      type: String,
      required: true,
    },

    // 投稿文字数
    desc: {
      type: String,
      max: 200,
    },

    img: {
      type: String,
    },

    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);

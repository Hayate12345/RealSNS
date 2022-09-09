const mongoose = require('mongoose');

// テーブル構造、カラム構造を定義する
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 25,
      // user名を重複させない
      unique: true,
    },

    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      min: 6,
      max: 30,
    },

    profilePicture: {
      type: String,
      // 画像のパスが入る
      default: '',
    },

    coverPicture: {
      type: String,
      // 画像のパスが入る
      default: '',
    },

    // 何人のフォロワーがいるのか
    followers: {
      type: Array,
      default: false,
    },

    // 何人フォローしているのか
    followings: {
      type: Array,
      default: false,
    },

    // 認証されているか
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // 概要欄の情報
    desc: {
      type: String,
      max: 100,
    },

    // 現在地の情報
    city: {
      type: String,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

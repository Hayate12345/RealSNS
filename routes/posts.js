const { post } = require('./users');

// expressの読み込み
const posts = require('express').Router();

// エンドポイントを定義していくもの // localhost:3000にアクセスした際に返す値を定義する,
// /のとこに指定のエンドポイントが入るイメージ？
posts.get('/', (request, response) => {
  response.send('起動テストです！');
});

// 定義した定数（router）を利用するためにExportsする
module.exports = posts;

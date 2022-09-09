// expressの定義
const express = require('express');
const app = express();

// dotenv読み込み
require('dotenv').config();

// users.jsのインポート
const userRoute = require('./routes/users');

// certification.jsのインポート
const certificationRoute = require('./routes/certification');

// posts.jsのインポート
const postsRoute = require('./routes/posts');

// 3000番ポートを使用する
const PORT = 3000;

// mongooseの読み込み
const mongoose = require('mongoose');

// DB接続
mongoose.connect(process.env.MONGOURL).then(() => {
  console.log('DBと接続が完了しました！');
});

// ------------------------------------------------

// ミドルウェアの設計（中間システムの設計）,
// useの第一引数にエンドポイント、第二引数に実行する関数
app.use('/api/user', userRoute);
app.use('/api/certification', certificationRoute);
app.use('/api/posts', postsRoute);

app.listen(PORT, () => console.log('サーバーが起動しました。'));

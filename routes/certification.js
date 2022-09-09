// expressの読み込み
const router = require('express').Router();

// Userスキーマの読み込み
const User = require('../models/User');

// エンドポイントを定義していくもの // localhost:3000にアクセスした際に返す値を定義する,
// /のとこに指定のエンドポイントが入るイメージ？
// router.get('/', (request, response) => {
//   response.send('起動テストです！');
// });

// ユーザー登録
router.post('/register', async (req, res) => {
  // 登録成功
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // 情報を保存する
    const user = await newUser.save();

    // エラーがない時の処理
    return res.status(200).json(user);
  } catch (err) {
    // サーバーエラー時の処理
    return res.status(500).json(err);
  }
});

// 定義した定数（router）を利用するためにExportsする
module.exports = router;

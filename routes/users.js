// Userモデルの読み込み
const User = require('../models/User');

// expressの読み込み
const users = require('express').Router();

// ユーザー情報の更新（UPDATEメソッド）
users.put('/:id', async (req, res) => {
  // DBのIDとgetのIDが一致している場合または権限がある（ログインしている場合？）
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // findByIdAndUpdateはモングース固有の関数の一つで、一つのID情報を更新するというもの
      // req.params.idはurl欄に載るIDのこと　Userモデルの値と参照して更新する
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json('更新が完了しました');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('不正なリクエストです');
  }
});

// ユーザー情報の削除 (DELETEメソッド)
users.delete('/:id', async (req, res) => {
  // DBのIDとgetのIDが一致している場合または権限がある（ログインしている場合？）
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json('削除が完了しました');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('不正なリクエストです');
  }
});

// ユーザー情報の取得（GETメソッド）
users.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    //パスワードなど共有されてはいけない情報を隠す 分割代入 隠す情報以外（other）が表示される情報である
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ユーザーのフォロー機能を自作する（PUTメソッド）
users.put('/:id/follow', async (req, res) => {
  // 他人のアカウントであればフォローができる
  if (req.body.userId !== req.params.id) {
    try {
      // 自分のユーザー情報
      const myUser = await User.findById(req.body.userId);

      // 他人のユーザー情報
      const othersUser = await User.findById(req.params.id);

      // 自分のアカウントがフォローする対象のアカウントをフォローしていなければフォローできる
      if (!othersUser.followers.includes(req.body.userId)) {
        // フォロワー情報　フォロワーの配列にフォローした人のIDが格納
        await othersUser.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });

        // フォロー情報　自分がフォローした人のID情報を配列に格納する
        await myUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json('アカウントをフォローしました。');
      } else {
        return res.status(403).json('すでにフォローしています。');
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    // 自分のアカウントはフォローできない
    return res.status(500).json('自分のアカウントはフォローできません');
  }
});

// ユーザーのフォロー解除機能を自作する（PUTメソッド）
users.put('/:id/unfollow', async (req, res) => {
  // 他人のアカウントであればフォローができる
  if (req.body.userId !== req.params.id) {
    try {
      // 自分のユーザー情報
      const myUser = await User.findById(req.body.userId);

      // 他人のユーザー情報
      const othersUser = await User.findById(req.params.id);

      // 自分がフォローしていればフォロー解除できる
      if (othersUser.followers.includes(req.body.userId)) {
        // 配列にフォローした人のID情報を入れる
        await othersUser.updateOne({
          // pullで配列から取り除くという意味
          $pull: {
            followers: req.body.userId,
          },
        });

        // 自分がフォローした人のID情報を配列に格納する
        await myUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json('フォロー解除しました');
      } else {
        return res.status(403).json('このユーザーはフォロー解除出来nai');
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    // 自分のアカウントはフォローできない
    return res.status(500).json('自分のアカウントはフォロー解除できません');
  }
});

// 定義した定数（certification）を利用するためにExportsする
module.exports = users;

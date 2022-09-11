// expressの読み込み
const posts = require('express').Router();

//  Postモデルの読み込み
const Post = require('../models/Post');

// Userモデルの読み込み
const User = require('../models/User');

// 投稿するapiを作る　（POSTメソッド）
posts.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿を編集するAPIを作る（PUTメソッド）
posts.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json('更新が完了しました');
    } else {
      return res.status(403).json('編集する権限がありません');
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 投稿を削除するAPIを作る（DELETEメソッド）
posts.delete('/:id', async (req, res) => {
  try {
    // 投稿したIDを取得する;
    const postId = await Post.findById(req.params.id);

    // 投稿したユーザーであれば削除できる
    if (postId.userId === req.body.userId) {
      const postDelete = await Post.deleteOne();
      return res.status(200).json('投稿を削除しました');
    } else {
      return res.status(403).json('削除する権限がありません');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿を取得するAPI（GETメソッド）
posts.get('/:id', async (req, res) => {
  try {
    // 投稿したIDを取得する
    const postId = await Post.findById(req.params.id);
    return res.status(200).json(postId);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿に対していいねするAPI（PUTメソッド）
posts.put('/:id/likes', async (req, res) => {
  try {
    // 投稿情報を取得する
    const post = await Post.findById(req.params.id);

    // 投稿にいいねしていなければいいねできる　自分のUserIDがあるかないかで判定する
    if (!post.likes.includes(req.body.userId)) {
      await Post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json('投稿にいいねしました');
    } else {
      // 投稿にすでにいいねが押されていたらいいねを解除する pullで配列から取り除く
      await Post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json('いいね解除しました');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// タイムライン フォローしているユーザーの投稿を取得する（GETメソッド）
posts.get('/timeline/all', async (req, res) => {
  try {
    // ユーザー情報の取得
    const user = await User.findById(req.body.userId);

    // 取得したユーザーの投稿情報を取得
    const userPost = await Post.find({ userId: user._id });

    // フォローしている人の投稿情報を取得する Promiseは非同期処理なので必要　ないと空の配列が返される
    const followingsPost = await Promise.all(
      // map関数で全ての投稿をfriendPostという変数で取得する
      user.followings.map((friendPost) => {
        return Post.find({ userId: friendPost });
      })
    );
    // スプレッド構文 配列から一つ一つ取り出す
    return res.status(200).json(userPost.concat(...followingsPost));
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 定義した定数（router）を利用するためにExportsする
module.exports = posts;

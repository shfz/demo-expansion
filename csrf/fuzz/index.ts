import { Fuzzlib, char } from "fzlib-node";
import * as c from "cheerio";

const fl = new Fuzzlib("http://localhost");

(async () => {
  // 1度ページを表示し、CSRFトークンを取得する
  let res = await fl.http.get("/register");
  let $ = c.load(res.data);
  let csrf_token = $('input[name="csrf_token"]').val()

  // CSRFトークンを使ってユーザー登録APIをテストする
  await fl.http.postForm("/register", {
    username: fl.fuzz.gen(char.lowercase()),
    password: fl.fuzz.genAscii(),
    csrf_token: csrf_token,
  });

  // 1度ページを表示し、CSRFトークンを取得する
  res = await fl.http.get("/login");
  $ = c.load(res.data);
  csrf_token = $('input[name="csrf_token"]').val()

  // CSRFトークンを使ってログインAPIをテストする
  await fl.http.postForm("/login", {
    username: fl.fuzz.gen(char.lowercase()),
    password: fl.fuzz.genAscii(),
    csrf_token: csrf_token,
  });

  // 1度ページを表示し、CSRFトークンを取得する
  res = await fl.http.get("/");
  $ = c.load(res.data);
  csrf_token = $('input[name="csrf_token"]').val()

  // CSRFトークンを使ってメモ追加APIをテストする
  await fl.http.postForm("/memo", {
    title: fl.fuzz.gen(char.lowercase()),
    text: fl.fuzz.genAscii(),
    csrf_token: csrf_token,
  });

  await fl.http.get("/logout");

  fl.http.done()
})();

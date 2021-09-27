import { Fuzzlib, char } from "fzlib-node";
import * as c from "cheerio";

const fl = new Fuzzlib("http://localhost");

(async () => {
  await fl.http.postForm("/register", {
    username: fl.fuzz.gen(char.lowercase()),
    password: fl.fuzz.genAscii(),
  });

  // ログインAPIをテスト
  const username = fl.fuzz.gen(char.lowercase())
  const res = await fl.http.postForm("/login", {
    username: username,
    password: fl.fuzz.genAscii(),
  });

  // ページにユーザー名が正しく表示されているか確認
  let $ = c.load(res.data);
  if($('p[id="user"]').text() !== username) {
    fl.http.error("No username in /login")
  };

  await fl.http.postForm("/memo", {
    title: fl.fuzz.gen(char.lowercase()),
    text: fl.fuzz.genAscii(),
  });

  await fl.http.get("/logout");

  fl.http.done();
})();

import { Fuzzlib, char } from "fzlib-node";
import * as c from "cheerio";
const totp = require("totp-generator");

const fl = new Fuzzlib("http://localhost");

(async () => {
  let res = await fl.http.postForm("/register", {
    username: fl.fuzz.gen(char.lowercase()),
    password: fl.fuzz.genAscii(),
  });

  // ユーザー登録時に表示されるシークレットを取得
  let $ = c.load(res.data);
  let totp_secret = $('p[id="totp"]').text();

  await fl.http.get("/logout");

  // ワンタイムパスワードを生成
  const one_time_password = totp(totp_secret)

  // ワンタイムパスワードを使用してログイン
  await fl.http.postForm("/login", {
    username: fl.fuzz.gen(char.lowercase()),
    password: fl.fuzz.genAscii(),
    totp: one_time_password
  });

  await fl.http.postForm("/memo", {
    title: fl.fuzz.gen(char.lowercase()),
    text: fl.fuzz.genAscii(),
  });

  await fl.http.get("/logout");

  fl.http.done()
})();

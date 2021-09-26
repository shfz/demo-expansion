import { Fuzzlib, char } from "fzlib-node";
import * as c from "cheerio";

const fl = new Fuzzlib("http://localhost");

(async () => {
  let res = await fl.http.get("/register");
  let $ = c.load(res.data);
  let csrf_token = $('input[name="csrf_token"]').val()

  await fl.http.postForm("/register", {
    username: fl.fuzz.gen(char.lowercase()),
    password: fl.fuzz.genAscii(),
    csrf_token: csrf_token,
  });

  res = await fl.http.get("/login");
  $ = c.load(res.data);
  csrf_token = $('input[name="csrf_token"]').val()

  await fl.http.postForm("/login", {
    username: fl.fuzz.gen(char.lowercase()),
    password: fl.fuzz.genAscii(),
    csrf_token: csrf_token,
  });

  res = await fl.http.get("/");
  $ = c.load(res.data);
  csrf_token = $('input[name="csrf_token"]').val()

  await fl.http.postForm("/memo", {
    title: fl.fuzz.gen(char.lowercase()),
    text: fl.fuzz.genAscii(),
    csrf_token: csrf_token,
  });

  await fl.http.get("/logout");

  fl.http.done()
})();

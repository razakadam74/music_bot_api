// @ts-check
var util = require('./util');
const express = require('express');
const http = require('http');
const url = require('url');
var cookieParser = require('cookie-parser');
const request = require('request');
const fs = require('fs');
const ytdl = require('ytdl-core');
var validUrl = require('valid-url');
const { stringify } = require('querystring');


async function main() {
  // Azure App Service will set process.env.port for you, but we use 3000 in development.
  const PORT = process.env.PORT || 3000;
  // Create the express routes
  let app = express();
  app.use(cookieParser());

  app.get('/clean', (req, res)=>{
    var input = (req.query.input) ? req.query.input.toString() : ""
    console.log({input})
    if (input.indexOf("<at>tooMoo</at>") != -1){
      input = input.split("<at>tooMoo</at>")[1]
    }
    input = input.trim()
    res.send(input)
  })

  app.get('/', async (req, res) => {
    var url = (req.query.url) ? req.query.url.toString() : ""
    console.log({url})
    if (url.indexOf("<at>tooMoo</at>") != -1){
      url = url.split("<at>tooMoo</at>")[1]
    }
    url = url.trim()

    if (validUrl.isHttpsUri(url)){
      ytdl.getInfo(url)
      .then(info=>{
        if (info != null){
          res.send({title : info.videoDetails.title, url : url})
        }else{
          console.log(`{info} is null`)
          res.send({error: `${url} is not a valid url`})
        }
      })
      .catch(err=>{
        console.log(err);
        res.send(err)
      })
    }else {
      console.log({url})
      res.send({error: `${url} is not a valid url`})
    }
  });

  // Create the HTTP server.
  let server = http.createServer(app);
  server.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
  });
}

main();

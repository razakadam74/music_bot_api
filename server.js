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


async function main() {
  // Azure App Service will set process.env.port for you, but we use 3000 in development.
  const PORT = process.env.PORT || 3000;
  // Create the express routes
  let app = express();
  app.use(cookieParser());

  app.get('/', async (req, res) => {
    var url = (req.query.url).toString()
    if (url.indexOf("tooMoo") != -1){
      url = url.split("tooMoo")[1]
    }
    url = url.trim()

    if (validUrl.isHttpsUri(url)){
      ytdl.getInfo(url)
      .then(info=>{
        res.send({title : info.videoDetails.title, url : url})        
      })
      .catch(err=>{
        res.status(500).send(err);
      })
    }else {
      res.status(500).send({error: `${url} is not a valid url`})
    }
    
  });

  function errorHandler (err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
  }

  app.use(errorHandler)

  // Create the HTTP server.
  let server = http.createServer(app);
  server.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
  });
}

main();

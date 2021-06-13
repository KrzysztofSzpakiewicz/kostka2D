//zmienne, stałe
var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var fs = require("fs");
var qs = require("querystring");
var Datastore = require("nedb");

var app = express();
var tab = [];
let data = [];
const PORT = process.env.PORT || 4000;
var players = [];
var playerID = 0;
var roomID = 0;
var records = [];

app.use(express.static("static/cwiczenia")); // serwuje pozostałe pliki, czyli ćwiczenia

app.use(bodyParser.urlencoded({ extended: true }));
//nasłuch na określonym porcie

//pobranie z bazy rekordów
var coll1 = new Datastore({
  filename: "kolekcja.db",
  autoload: true,
});

coll1.find({}, function (err, docs) {
  records = docs;
  records.sort(compare);
});

app.get("/", function (req, res) {
  console.log("ścieżka do katalogu głównego aplikacji: " + __dirname);
  res.sendFile(path.join(__dirname + "/static/cwiczenia/game.html"));
});
app.get("/getData", function (req, res) {
  //   console.log(players);
  const obj = { players: players, records: records };
  res.send(obj);
});

app.post("/addplayer", function (req, res) {
  console.log("ccc");

  var allData = "";

  req.on("data", function (data) {
    console.log("data: " + data);
    allData += data;
  });

  req.on("end", function (data) {
    players.push({
      player: JSON.parse(allData).name,
      id: playerID,
      startTime: JSON.parse(allData).startTime,
      status: "playing",
    });
    let finish = { name: JSON.parse(allData).name, yourID: playerID };
    // allData.yourID = playerID
    playerID++;
    console.log(finish);
    res.end(JSON.stringify(finish));
  });
});

app.post("/uploadScoore", function (req, res) {
  console.log("ccc");

  var allData = "";

  req.on("data", function (data) {
    console.log("data: " + data);
    allData += data;
  });

  req.on("end", function (data) {
    allData = JSON.parse(allData);
    for (let i = 0; i < players.length; i++) {
      console.log(i, console.log(players[i].id));
      if (players[i].id == allData.id) {
        players[i].status = "finished";
        players[i].startTime = allData.time;
        coll1.insert(
          { player: players[i].player, time: allData.time },
          function (err, newDoc) {
            console.log("dodano dokument (obiekt):");
            console.log(newDoc);
            console.log("losowe id dokumentu: " + newDoc._id);
          }
        );
        coll1.find({}, function (err, docs) {
          console.log(docs);
          console.log(docs.length);
          records = docs;
          records.sort(compare);
          console.log("SORTED");
          console.log(records);
          if (records.length > 10) {
            coll1.remove(
              { _id: records[records.length - 1]._id },
              {},
              function (err, numRemoved) {
                console.log("usunięto dokumentów: ", numRemoved);
              }
            );
            records.pop();
          }
        });
      }
    }
  });
});

app.post("/drop", function (req, res) {
  let allData = "";
  req.on("data", function (data) {
    console.log("dddddddata " + data);
    allData += data;
  });
  req.on("end", function (data) {
    console.log(JSON.parse(allData));
    console.log("adsasasasdadsadsadsadsadsadsadsadsads");
    console.log(players);
    console.log(typeof players);

    players.foreach(function (element) { });
  });
});

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});

function compare(a, b) {
  if (a.time < b.time) {
    return -1;
  }
  if (a.time > b.time) {
    return 1;
  }
  return 0;
}

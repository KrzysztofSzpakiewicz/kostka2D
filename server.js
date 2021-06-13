//zmienne, stałe
var bodyParser = require("body-parser")
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
var getnum = 0
app.use(express.static("static/cwiczenia")); // serwuje pozostałe pliki, czyli ćwiczenia

app.use(bodyParser.urlencoded({ extended: true }));

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
    res.sendFile(path.join(__dirname + "/static/cwiczenia/game.html"));
});

app.post("/getData", function (req, res) {
    var allData = "";

    req.on("data", function (data) {
        allData += data;
    });
    req.on("data", function (data) {
        allData = JSON.parse(allData);
        const obj = { players: players, records: records };
        console.log(players)
        res.send(obj);
        console.log(allData.id)
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == allData.id) {
                console.log("PPP")
                players[i].lastSeen = 0
            }
        }

    });
});

app.post("/addplayer", function (req, res) {

    var allData = "";

    req.on("data", function (data) {
        allData += data;
    });

    req.on("end", function (data) {
        players.push({
            player: JSON.parse(allData).name,
            id: playerID,
            startTime: JSON.parse(allData).startTime,
            status: "playing",
            lastSeen: 0
        });
        let finish = { name: JSON.parse(allData).name, yourID: playerID };
        // allData.yourID = playerID
        playerID++;
        res.end(JSON.stringify(finish));
    });
});

app.post("/uploadScoore", function (req, res) {

    var allData = "";

    req.on("data", function (data) {
        allData += data;
    });

    req.on("end", function (data) {
        allData = JSON.parse(allData);
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == allData.id) {
                players[i].status = "finished";
                players[i].startTime = allData.time;
                coll1.insert(
                    { player: players[i].player, time: allData.time },
                    function (err, newDoc) {
                    }
                );
                coll1.find({}, function (err, docs) {
                    records = docs;
                    records.sort(compare);
                    if (records.length > 10) {
                        coll1.remove(
                            { _id: records[records.length - 1]._id },
                            {},
                            function (err, numRemoved) {
                            }
                        );
                        records.pop();
                    }
                });
            }
        }
    });
});




app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT);
});
setInterval(deleteInactive, 1000)

function deleteInactive() {
    for (let i = 0; i < players.length; i++) {
        players[i].lastSeen++
        if (players[i].lastSeen > 5) {
            players.splice(i, 1);
        }
    }
}






function compare(a, b) {
    if (a.time < b.time) {
        return -1;
    }
    if (a.time > b.time) {
        return 1;
    }
    return 0;
}

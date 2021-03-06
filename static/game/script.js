var ok = true
var times = [];
var timer;
var data;
var myID = "none"
var room;
var currentTime;
var myName
var functions
getData();

var getter = setInterval(getData, 1000);
var timer = setInterval(displayTime, 50);
var recorder = setInterval(displayRecords, 50);

async function getData() {
    const body = JSON.stringify({ "id": myID }); // body czyli przesyłane na serwer dane
    const headers = { "Content-Type": "application/json" }; // nagłowek czyli typ danych

    await fetch("/getData", { method: "post", body, headers }) // fetch
        .then((response) => response.text())
        .then((d) => (data = JSON.parse(d)));
}





function fetchMyData(x) {
    const body = JSON.stringify({ name: x, startTime: currentTime }); // body czyli przesyłane na serwer dane

    const headers = { "Content-Type": "application/json" }; // nagłowek czyli typ danych
    fetch("/addplayer", { method: "post", body, headers }) // fetch
        .then((response) => response.json())
        .then(
            (data) => (myID = data.yourID) // dane odpowiedzi z serwera
        );
}

function uploadScoore() {

    clearInterval(timer);
    let time = getPlayingTime();
    const body = JSON.stringify({ time: time, id: myID }); // body czyli przesyłane na serwer dane

    const headers = { "Content-Type": "application/json" }; // nagłowek czyli typ danych
    fetch("/uploadScoore", { method: "post", body, headers }) // fetch
        .then((response) => response.json())
        .then(
        );

    //wyświetlenie wygranej
    let x = document.getElementById("winScreen");
    x.style.display = "inline";


    if (data.records.length == 10) {
        if (time < data.records[data.records.length - 1].time) {
            x.innerHTML = convertTime(time) + "<br> Nowy rekord";
        } else {
            x.innerHTML =
                convertTime(time) +
                "<br> Niestety, w pierwszej 10 to ty nie jesteś";
        }
    } else {
        x.innerHTML = convertTime(time) + "<br> Nowy rekord";
    }

    document.getElementsByClassName("box")[0].style.left = "-10px";
    document.getElementsByClassName("box")[0].classList.remove("extend1")
    document.getElementById("replay").style.top = "-10px";
    document.getElementById("replay").classList.remove("extend2")
    document.getElementById("open").classList.remove("extend3")

    // transform: translateY(210px);
}

function JaChceJeszczeRaz() {
    document.getElementsByClassName("box")[0].classList.add("extend1")
    document.getElementById("replay").classList.add("extend2")
    document.getElementById("open").classList.add("extend3")
    let x = document.getElementById("winScreen").style.display = "none"
    document.getElementsByClassName("box")[0].style.left = "-300px";
    document.getElementById("replay").style.top = "-220px";

    clearInterval(getter);
    clearInterval(timer);
    startClock();
    // drop()
    getter = setInterval(getData, 1000);
    timer = setInterval(displayTime, 50);
    functions.randomizer();
    setTimeout(() => {
        fetchMyData(myName)
    }
        , 1000)
    setTimeout(() => {
        ok = true
    }, 4000)
}

document.getElementById("x").addEventListener("click", function () {


    document.getElementById("login").style.display = "none";
    myName = document.getElementById("name").value;

    myName = myName.replace(/\s+/g, '');
    if (myName.length == 0) {
        alert('nick too short, ur name is anopnymous')
        startClock();
        myName = 'anonymous'
        fetchMyData(myName);
    }
    else if (myName.length > 13) {
        alert('nick too long, ur nick is ' + myName.slice(0, 13))
        startClock();
        myName = myName.slice(0, 12)
        fetchMyData(myName);
    }
    else if (myName == "ds" || myName == "DS" || myName == "Ds" || myName == "dS") {
        startClock();
        myName = 'MistrzDS'
        fetchMyData(myName);
    }
    else {
        startClock();
        fetchMyData(myName);
    }
    document.getElementById("nick").innerHTML = myName

});


//CZAS

function startClock() {
    currentTime = Date.now();
}

function getPlayingTime() {
    var time = Date.now() - currentTime;
    return time;
}

function convertTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}




function displayTime() {
    //twój czas
    document.getElementById("timeBlock").innerHTML = convertTime(
        getPlayingTime()
    );
}
function displayRecords() {
    //rekordy w sidebarze
    var table = "<table><tr><td>NICK</td><td>CZAS</td></tr>";
    data.records.forEach((element) => {
        table +=
            "<tr><td>" +
            element.player +
            "</td><td>" +
            convertTime(element.time) +
            "</td></tr>";
    });
    table += "</table>";
    document.getElementById("records").innerHTML = table;
    // gracze w sidebarze
    table = "<table><tr><td>NICK</td><td>CZAS</td></tr>";
    data.players.forEach((element) => {
        if (element.status == "playing") {
            table +=
                "<tr><td>" +
                element.player +
                "</td><td>" +
                convertTime(Date.now() - element.startTime) +
                "</td></tr>";
        } else {
            table +=
                "<tr><td>" +
                element.player +
                "</td><td>" +
                convertTime(element.startTime) +
                "</td></tr>";
            // playerString += element.player + " Zakończono: " + convertTime(element.startTime) + "<br>"
        }
    });
    table += "</table>";
    document.getElementById("currentPlayers").innerHTML = table;

    //rekordy przy logowaniu

    var playerString = "";
    data.players.forEach((element) => {
        if (element.status == "playing") {
            playerString +=
                element.player +
                " " +
                convertTime(Date.now() - element.startTime) +
                "<br>";
        } else {
            playerString +=
                element.player +
                " Zakończono: " +
                convertTime(element.startTime) +
                "<br>";
        }
    });
    document.getElementById("players").innerHTML = playerString;
}




























$(document).ready(function () {

    class Game {
        constructor() {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
            this.renderer = new THREE.WebGLRenderer();
            //this.axes = new THREE.AxesHelper(1000);
            this.allElements = [];
            this.fiveElementsTabs = [];
            this.Keys = {
                KeyA: false,
                KeyD: false,
                KeyW: false,
                KeyS: false,
            };
            this.x = Math.PI / 2;
            this.z = Math.PI / 2;
            this.theOne;
            this.difference = 0;
            this.indexOne;
            this.indexSecond;
            this.ifCorrect = 0; // PROBLEM
            this.correctTest = 0; //PROBLEM
        }
        sceneGenerator() {
            //generowanie sceny - przewidywane 0 problemów
            this.renderer.setClearColor(0x000000);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            $("#root").append(this.renderer.domElement);
            this.camera.position.set(500, 500, 0);
            this.camera.lookAt(this.scene.position);
            //this.scene.add(this.axes);
            this.render();
        }
        render() {
            // render - intervał - potencjalny 1 problem, to da się zrobić lepiej(RequestAnimationFrame)
            setInterval(() => {
                this.camera.lookAt(this.scene.position);
                window.addEventListener("resize", onWindowResize, false);
                function onWindowResize() {
                    this.camera.aspect = window.innerWidth / window.innerHeight;
                    this.camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }
                this.renderer.render(this.scene, this.camera);
                this.handleEventListeners();
            }, 5);
        }
        mapGenerator() {
            //generator bloczków z texturą - 0 problemów
            var posz = -108;
            var posx = -108;
            var elemindex = 1;
            for (let j = 0; j < 5; j++) {
                for (let i = 0; i < 5; i++) {
                    var geometry = new THREE.BoxGeometry(50, 50, 50);
                    var material = new THREE.MeshBasicMaterial({
                        map: new THREE.TextureLoader().load(
                            "mats/" + elemindex + ".png"
                        ),
                        side: THREE.DoubleSide,
                        wireframe: false,
                    });
                    var cube = new THREE.Mesh(geometry, material);
                    cube.position.set(posx, 0, posz);
                    cube.rotation.y = Math.PI / 2;
                    this.scene.add(cube);
                    posz += 54;
                    this.allElements.push([cube, elemindex]);
                    elemindex++;
                }
                posx += 54;
                posz = -108;
            }
        }
        createIntelligentTable() {
            //tworzenie tabliczy po 5r, 5c - 0 problemów
            var tabCounter = 0;
            var tabIndex = -1;
            for (const e of this.allElements) {
                if (tabCounter % 5 == 0) {
                    this.fiveElementsTabs.push([]);
                    tabIndex++;
                }
                this.fiveElementsTabs[tabIndex].push(e);
                tabCounter++;
            }
            tabIndex = 4;
            var out = [
                [0, 5, 10, 15, 20],
                [1, 6, 11, 16, 21],
                [2, 7, 12, 17, 22],
                [3, 8, 13, 18, 23],
                [4, 9, 14, 19, 24],
            ];
            for (const e of out) {
                this.fiveElementsTabs.push([]);
                tabIndex++;
                for (const ee of e) {
                    this.fiveElementsTabs[tabIndex].push(this.allElements[ee]);
                }
            }
        }
        handleEventListeners() {
            // event listenery - potencjalny 1 problem -  dotyczącyy f checkColorStatus() - po kliknięciu osła w teorii wygrana(patrz alert)
            //zanim szykasz problemu do tego przeczytaj wszytsko gdzie sie zaczyna
            $("#osioll").on("click", () => {
                if (ok == true) {
                    ok = false
                    setTimeout(() => {
                        JaChceJeszczeRaz();

                    }, 300)
                }
            });
            $(document).keydown((e) => {
                this.Keys[e.code] = true;
            });
            $(document).keyup((e) => {
                this.Keys[e.code] = false;
            });
            this.camera.position.z = 200 * Math.cos(this.z);
            this.camera.position.x = 200 * Math.sin(this.x);
            this.camera.lookAt(this.scene.position);
            if (this.Keys.KeyA == true) {
                this.x -= 0.03;
                this.z -= 0.03;
                this.camera.position.z = 200 * Math.cos(this.z);
                this.camera.position.x = 200 * Math.sin(this.x);
                this.camera.lookAt(this.scene.position);
            }
            if (this.Keys.KeyD == true) {
                this.x += 0.03;
                this.z += 0.03;
                this.camera.position.z = 200 * Math.cos(this.z);
                this.camera.position.x = 200 * Math.sin(this.x);
                this.camera.lookAt(this.scene.position);
            }
            if (this.Keys.KeyS == true && this.camera.fov < 80) {
                this.camera.fov += 0.5;
                this.camera.updateProjectionMatrix();
                this.camera.lookAt(this.scene.position);
            }
            if (this.Keys.KeyW == true && this.camera.fov > 10) {
                this.camera.fov -= 0.5;
                this.camera.updateProjectionMatrix();
                this.camera.lookAt(this.scene.position);
            }
        }
        randomizer() {
            //losowe ustawianie bloczków - potencjalny 1 problem - f checkColorStatus() - może tutaj trzeba resetować 2 zmienne z tej f
            var sectionColors = [];
            for (let i = 0; i < 50; i++) {
                var rowColumnIndex =
                    this.fiveElementsTabs[Math.floor(Math.random() * 10)];
                for (let j = 0; j < 5; j++) {
                    sectionColors.push(rowColumnIndex[j][0].material);
                }
                rowColumnIndex[0][0].material = sectionColors[1];
                rowColumnIndex[1][0].material = sectionColors[2];
                rowColumnIndex[2][0].material = sectionColors[3];
                rowColumnIndex[3][0].material = sectionColors[4];
                rowColumnIndex[4][0].material = sectionColors[0];
                sectionColors = [];
            }
        }
        moveItems() {
            //przemieszczenie obiektów - 0 problemów
            var colors = [];
            for (let k = 0; k < this.difference; k++) {
                if (this.indexSecond > this.indexOne) {
                    for (let i = 0; i < 5; i++) {
                        colors.push(this.theOne[i][0].material);
                    }
                    this.theOne[0][0].material = colors[4];
                    this.theOne[1][0].material = colors[0];
                    this.theOne[2][0].material = colors[1];
                    this.theOne[3][0].material = colors[2];
                    this.theOne[4][0].material = colors[3];
                    colors = [];
                    this.checkColorStatus();
                } else if (this.indexSecond < this.indexOne) {
                    for (let i = 0; i < 5; i++) {
                        colors.push(this.theOne[i][0].material);
                    }
                    this.theOne[0][0].material = colors[1];
                    this.theOne[1][0].material = colors[2];
                    this.theOne[2][0].material = colors[3];
                    this.theOne[3][0].material = colors[4];
                    this.theOne[4][0].material = colors[0];
                    colors = [];
                    this.checkColorStatus();
                }
            }
        }
        checkColorStatus() {
            //CRITICAL PROBLEM - wielokrtona możliwośc wywołania również po kliknięciu osła, zły sposób aktualizacji
            var tablicaUposledzonejKolejnosci = [
                5, 4, 3, 2, 1, 10, 9, 8, 7, 6, 15, 14, 13, 12, 11, 20, 19, 18, 17,
                16, 25, 24, 23, 22, 21,
            ];
            for (const iterator of this.allElements) {
                if (
                    iterator[0].material.map.image.outerHTML ==
                    '<img crossorigin="anonymous" src="mats/' +
                    tablicaUposledzonejKolejnosci[this.ifCorrect] +
                    '.png">'
                ) {
                    this.correctTest++;
                }
                this.ifCorrect++;
            }
            if (this.correctTest == 25) {
                //zakończenie gry

                uploadScoore();

                setTimeout(() => {
                    this.correctTest = 0;
                    this.ifCorrect = 0;
                }, 200);
            }
        }
        selectingBlocks() {
            // wybór obiektóe-  1 problem ruchowi podlega wszytsko na scenie, nie ma ograniczenia do blocków - try catch, to gdzieś trzeba zmienić
            try {
                var raycaster = new THREE.Raycaster();
                var mouseVector = new THREE.Vector2();
                var first;
                var second;
                $(document).mousedown(() => {
                    this.correctTest = 0;
                    this.ifCorrect = 0;
                    mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
                    mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
                    raycaster.setFromCamera(mouseVector, this.camera);
                    var intersects = raycaster.intersectObjects(
                        this.scene.children
                    );
                    try {
                        first = intersects[0].object;
                    } catch { }
                });
                $(document).mouseup(() => {
                    mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
                    mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
                    raycaster.setFromCamera(mouseVector, this.camera);
                    var intersects = raycaster.intersectObjects(
                        this.scene.children
                    );
                    try {
                        second = intersects[0].object;
                    } catch { }
                    for (const element of this.fiveElementsTabs) {
                        for (const ee of element) {
                            if (ee[0] == first) {
                                for (const e of element) {
                                    if (e[0] == second) {
                                        this.theOne = element;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    try {
                        for (let i = 0; i < 5; i++) {
                            if (first == this.theOne[i][0]) {
                                this.indexOne = i;
                            } else if (second == this.theOne[i][0]) {
                                this.indexSecond = i;
                            }
                        }
                        this.difference = Math.abs(this.indexSecond - this.indexOne);
                    } catch { }
                    this.moveItems();
                    // setTimeout(, 500)
                    first = undefined;
                    second = undefined;
                    this.indexOne = undefined;
                    this.indexSecond = undefined;
                });
            } catch {
                console.log("nic nie widziałeś");
            }
        }
    }



    functions = new Game()
    functions.sceneGenerator();
    functions.mapGenerator();
    functions.createIntelligentTable();
    functions.handleEventListeners();
    functions.randomizer();
    functions.selectingBlocks();
});
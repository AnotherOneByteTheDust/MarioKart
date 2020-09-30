import players from "../assets/img/kart-*.png";
import sounds from "../assets/mp3/*.mp3";
import { KartPlayer } from "./KartPlayer.js";
import { Howl, Howler } from "howler";

const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");
const road = document.querySelector(".road");
const karts = [];
let timer = null;
let characterPicked = null;

//
// CREATE KARTS
//

for (const [name, image] of Object.entries(players)) {
  const config = {
    image,
    y: karts.length * 64,
  };
  const kart = new KartPlayer(name, config);

  road.appendChild(kart);
  kart.addEventListener("click", chooseCharacter, true);
  karts.push(kart);
}

//
// AUDIOS
//

let startSound = new Howl({
  src: sounds["startRoad"],
});

let circuitSong = new Howl({
  src: sounds["rainBow"],
});

let resultsSound = new Howl({
  src: sounds["winningResults"],
});

let finishSounds = {
  sound1: new Howl({
    src: sounds["finish1"],
    onend: () => resultsSound.play(),
  }),
  sound2: new Howl({
    src: sounds["finish2"],
    onend: () => resultsSound.play(),
  }),
  sound3: new Howl({
    src: sounds["finish3"],
    onend: () => resultsSound.play(),
  }),
};

//
// CUENTA ATRAS
//

function countDown() {
  let countdown = new Howl({
    src: sounds["raceStart"],
  });

  countdown.play();
  var el = document.querySelector("#startText");
  var i = 3;

  var showTime = setInterval(() => {
    if (i == 3) {
      el.removeAttribute("hidden");
    }
    if (i > 0) {
      el.innerHTML = i;
      i--;
    } else {
      clearInterval(showTime);
      el.innerHTML = "";
      el.setAttribute("hidden", "true");
      circuitSong.play();
      timer = setInterval(() => startIteration(), 1000 / 60);
    }
  }, 900);
}
// CLICK EN EMPEZAR

const startRace = () => {
  if (characterPicked) {
    karts.forEach((kart) => {
      kart.removeEventListener("click", chooseCharacter, true);
    });

    startSound.play();
    setTimeout(() => {
      countDown();
    }, 2200);
    startButton.disabled = true;
    restartButton.disabled = true;
  }
};

// ITERACIONES

const startIteration = () => {
  karts.forEach((kart) => kart.inc());

  if (karts.some((kart) => kart.isWinner())) endRade();
};

// TERMINAR CARRERA

const endRade = () => {
  clearInterval(timer);
  let position = [];
  karts.forEach((kart) => {
    kart.isWinner() ? kart.win() : kart.lose();
    position.push(kart.x);
    if (characterPicked == kart.name) {
      characterPicked = [characterPicked, kart.x];
    }
  });
  position = position.sort().reverse();
  let pos = position.findIndex((xvalue) => xvalue == characterPicked[1]);
  let el = document.querySelector("#info");

  if (pos == 0 || pos == 1) {
    finishSounds["sound1"].play();
    el.innerHTML = `¡Felicidades! Has quedado ${pos + 1}`;
  } else if (pos == 2 || pos == 3) {
    finishSounds["sound2"].play();
    el.innerHTML = `Has quedado ${pos + 1}. Podría haber sido peor...`;
  } else {
    finishSounds["sound3"].play();
    el.innerHTML = `¡Hoy no es tu día! Has quedado ${pos + 1}`;
  }
  circuitSong.stop();
  restartButton.disabled = false;
};

// CHOOSE CHARACTER
function chooseCharacter(e) {
  karts.forEach((kart) => {
    kart.style.filter = "";
  });
  e.target.style.filter = "drop-shadow(0px 0px 20px red)";
  characterPicked = e.target.name;
  let el = document.querySelector("#info");
  el.innerHTML = "";
}

// EVENT LISTENERS

startButton.addEventListener("click", () => {
  startRace();
});

restartButton.addEventListener("click", () => {
  if (startButton.disabled) {
    finishSounds["sound1"].stop();
    finishSounds["sound2"].stop();
    finishSounds["sound3"].stop();
    circuitSong.stop();
    resultsSound.stop();
    karts.forEach((kart) => {
      kart.restart();
      kart.addEventListener("click", chooseCharacter, true);
    });
    startButton.disabled = false;
    characterPicked = null;
    let el = document.querySelector("#info");
    el.innerHTML = "Elige un kart";
  }
});

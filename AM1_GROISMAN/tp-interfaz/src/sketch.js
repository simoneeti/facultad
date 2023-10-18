let notes = [];
let obstacles = [];
let stopped = false;

let sounds = {};
let synths = {};
// function preload() {
//   sounds.drop = loadSound("/sounds/drop.mp3");
// }

function setup() {
  queryMidi();
  createCanvas(innerWidth - 20, innerHeight - 20);
}

function draw() {
  if (stopped) return;
  clear();
  gameTick();
}

const gameTick = () => {
  for (let i = 0; i < notes.length; i++) {
    notes[i].tick();
  }
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].tick();
  }
};

const addNote = (velocity = 0, esPar = false) => {
  const n = new Nota(Math.random() * -PI, "", esPar);
  if (velocity) {
    n.width = velocity * 200;
  } else {
    n.isHolding = true;
  }
  n.esPar = esPar;

  notes.push(n);
};

const addObstacle = () => {
  obstacles.push(
    new Obstacle(
      Math.random() * innerWidth,
      Math.random() * innerHeight,
      Math.random() * 100,
      Math.random() * PI
    )
  );
};

var randomProperty = function(obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

const killObject = (obj) => {
  if (obj.constructor.name === "Nota") {
    notes.splice(
      notes.findIndex((e) => e._ID === obj._ID),
      1
    );
    if (Object.keys(notes).length === 0) {
      const note_scale = randomProperty(scales);
      scale = randomProperty(note_scale);
    }
  }
  // if (obj.constructor.name === "Nota") {
  //   notes.splice(notes.findIndex(e=>e._ID === this._ID), 1)
  // }
  // console.log(obj.constructor.name, obj._ID);
};

addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.key === "h") addNote();
  if (e.key === "o") addObstacle();
  if (e.key === "s") stopped = !stopped;
});
addEventListener("keyup", (e) => {
  if (e.key === "h") notes[notes.length - 1].isHolding = false;
  if (e.key === "p") startSound();
});

let notes = [];
let obstacles = [];
let stopped = false;

let sounds = {};
function preload() {
  sounds.drop = loadSound("/static/drop.mp3");
}

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

const addNote = (velocity = 0) => {
  const n = new Nota(Math.random() * -PI, "", "");
  if (velocity) {
    n.width = velocity * 200;
  } else {
    n.isHolding = true;
  }
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

addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.key === "h") addNote();
  if (e.key === "o") addObstacle();
  if (e.key === "s") stopped = !stopped;
});
addEventListener("keyup", (e) => {
  if (e.key === "h") notes[notes.length - 1].isHolding = false;
});

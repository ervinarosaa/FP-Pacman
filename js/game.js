const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");
const createRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

let fps = 30;
let Block = 20; //ukuran block di canvas
let wall_color = "#342DCA";
let wall_space = Block / 1.5;
let wall_stripe = (Block - wall_space) / 2;
let wallInnerColor = "black";
let pills_color = "#FEB897";
let skor = 0;
let hantu = [];
let jml_hantu = 4;
let nyawa = 3;
let jml_pills = 0;

const Kanan = 4;
const Atas = 3;
const Kiri = 2;
const Bawah = 1;

let lokasi_hantu = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 },
];

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 1, 2, 1],
  [1, 2, 1, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

//hitung jumlah pills
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[0].length; j++) {
    if (map[i][j] == 2) {
      jml_pills++;
    }
  }
}

let targetRandom_hantu = [
  { x: 1 * Block, y: 1 * Block },
  { x: 1 * Block, y: (map.length - 2) * Block },
  { x: (map[0].length - 2) * Block, y: Block },
  {
    x: (map[0].length - 2) * Block,
    y: (map.length - 2) * Block,
  },
];

let gameLoop = () => {
  draw();
  update(); 
};
let gameInterval = setInterval(gameLoop, 1000 / fps);

let update = () => {
  //todo
  pacman.gerak();
  pacman.eat();
  for (let i = 0; i < hantu.length; i++) {
    hantu[i].gerak();
  }

  if (pacman.cekGhostCrash()) {
    console.log("hit");
    restartGame();
  }

  if (skor > jml_pills-1) {
    pacman.ubahAnimasi();
    draw();
    setTimeout(() => {
      drawWin();
    }, 500); {
      console.log('win');
      const gameover = document.getElementById('win');
      gameover.play();
      gameover.playbackRate = 1;
    }
    clearInterval(gameInterval);
  }
};

let restartGame = () => {
  buatPacmanBaru();
  buatHantu();
  nyawa--;
  {
    var audio = new Audio('./../FP-Pacman/audio/die.mp3');
    audio.playbackRate = 1.5;
    audio.play();
  if (nyawa == 0)
   {
    draw();
    gameOver();
   }
  }
};

let gameOver = () => {
  clearInterval(gameInterval);
  drawGameOver();
  {
    console.log('gameover');
    const gameover = document.getElementById('gameover');
    gameover.play();
    gameover.playbackRate = 1;
  }
};

let drawGameOver = () => {
  canvasContext.font = "60px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Game Over", 70, 230);
};

let drawWin = () => {
  canvasContext.font = "60px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("You Win!", 90, 230);
};

let drawnyawa = () => {
  canvasContext.font = "30px";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Lives: ", 220, Block * (map.length + 1) + 10);
  for (let i = 0; i < nyawa; i++) {
    canvasContext.drawImage(
      pacmanFrames,
      2 * Block,
      0,
      Block,
      Block,
      350 + i * Block,
      Block * map.length + 10,
      Block,
      Block
    );
  }
};

let drawPills = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        createRect(
          j * Block + Block / 3,
          i * Block + Block / 3,
          Block / 3,
          Block / 3,
          pills_color
        );
      }
    }
  }
};

let drawskor = () => {
  canvasContext.font = "30px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(
    "Score: " + skor,
    0,
    Block * (map.length + 1) + 10
  );
};

let drawHantu = () => {
  for (let i = 0; i < hantu.length; i++) {
    hantu[i].draw();
  }
};

let draw = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect(0, 0, canvas.width, canvas.height, "black");
  //todo
  drawWalls();
  drawPills();
  pacman.draw();
  drawskor();
  drawHantu();
  drawnyawa();
};

let drawWalls = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 1) {
        //then it is a wall
        createRect(
          j * Block,
          i * Block,
          Block,
          Block,
          wall_color
        );
        if (j > 0 && map[i][j - 1] == 1) {
          createRect(
            j * Block,
            i * Block + wall_stripe,
            wall_space + wall_stripe,
            wall_space,
            wallInnerColor
          );
        }
        if (j < map[0].length - 1 && map[i][j + 1] == 1) {
          createRect(
            j * Block + wall_stripe,
            i * Block + wall_stripe,
            wall_space + wall_stripe,
            wall_space,
            wallInnerColor
          );
        }
        if (i > 0 && map[i - 1][j] == 1) {
          createRect(
            j * Block + wall_stripe,
            i * Block,
            wall_space,
            wall_space + wall_stripe,
            wallInnerColor
          );
        }
        if (i < map.length - 1 && map[i + 1][j] == 1) {
          createRect(
            j * Block + wall_stripe,
            i * Block + wall_stripe,
            wall_space,
            wall_space + wall_stripe,
            wallInnerColor
          );
        }
      }
    }
  }
};

let buatPacmanBaru = () => {
  pacman = new Pacman(
    Block,
    Block,
    Block,
    Block,
    Block / 5
  );
};

let buatHantu = () => {
  hantu = [];
  for (let i = 0; i < jml_hantu; i++) {
    let newGhost = new Ghost(
      9 * Block + (i % 2 == 0 ? 0 : 1) * Block,
      10 * Block + (i % 2 == 0 ? 0 : 1) * Block,
      Block,
      Block,
      pacman.speed / 2,
      lokasi_hantu[i % 4].x,
      lokasi_hantu[i % 4].y,
      124,
      116,
      6 + i
    );
    hantu.push(newGhost);
  }
};

buatPacmanBaru();
buatHantu();
gameLoop();

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;
  setTimeout(() => {
    if (k == 37 || k == 65) {
      //kiri
      pacman.nextArah = Kiri;
    } else if (k == 38 || k == 87) {
      //atas
      pacman.nextArah = Atas;
    } else if (k == 39 || k == 68) {
      //kanan
      pacman.nextArah = Kanan;
    } else if (k == 40 || k == 83) {
      //bawah
      pacman.nextArah = Bawah;
    }
  }, 1);
});


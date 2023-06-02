import "./style.css";

import p5 from "p5";
import Missile from "./missile";
import Player from "./player";
import formatTimeInterval from "./time-format";
import Star from "./star";
import Flare from "./flare";

new p5((p: p5) => {
  let missiles: Missile[] = [];
  let player: Player;

  const numStars = 50;
  const stars: Star[] = [];

  let spawnRate = 0.1; // chance of spawning every frame
  let maxMissiles = 25;

  let rechargeRate = 20; // how many frames each missile takes to reload
  let flareFireRate = 5; // how many frames before you can fire again

  let lastFireFrame = 0;

  let gameIntro = true;

  let gameOver = false;
  let startTime = Date.now();
  let endTime = -1;
  let distance = 0;
  let numDestroyed = 0;

  const keysPressed = new Set<string>();
  const ALLOWED_KEYS = ["w", "a", "s", "d", "backspace"];

  const distSq = (a: p5.Vector, b: p5.Vector): number => {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return x * x + y * y;
  };

  const restartGame = () => {
    keysPressed.clear();
    endTime = -1;
    numDestroyed = 0;
    startTime = Date.now();
    lastFireFrame = 0;
    distance = 0;
    player = new Player(p, p.width / 2, p.height / 2);
    missiles.length = 0;

    gameIntro = false;
    gameOver = false;
  };

  const drawBar = (
    value: number,
    maxValue: number,
    offset: number,
    name: string,
    color: p5.Color
  ) => {
    const barWidth = p.map(value, 0, maxValue, 0, p.width);
    color.setAlpha(100);
    p.push();
    p.noStroke();
    p.rectMode(p.CORNER);
    p.translate(0, offset);
    p.fill(color);
    p.rect(0, 0, barWidth, 30);
    p.textAlign(p.LEFT, p.TOP);
    p.fill("white");
    p.textSize(20);
    p.text(`${name}: ${value}/${maxValue}`, 5, 5);
    p.pop();
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    player = new Player(p, p.width / 2, p.height / 2);

    for (let i = 0; i < numStars; i++) {
      stars.push(new Star(p));
    }
  };

  p.draw = () => {
    p.background(0);

    if (gameIntro) {
      p.textAlign(p.CENTER, p.CENTER);
      // instructions
      p.textSize(20);
      p.fill("grey");
      p.text(
        "You are an alien trying to fly back to space to rejoin your colony (using wasd of course).\n \
However, the Earthians are trying to shoot you down with their guided missiles >:(\n \
Luckily, you have flares you can use to distract them, press <backspace> to activate them :D",
        p.width / 2,
        p.height / 2
      );

      // start
      p.text(
        "Press space to begin your journey back into space",
        p.width / 2,
        p.height - 40
      );

      return;
    }

    if (gameOver) {
      p.textAlign(p.CENTER, p.CENTER);
      // main text
      p.textSize(25);
      p.fill("grey");
      p.text("Game over!", p.width / 2, p.height / 2);
      // stats
      p.textSize(20);
      p.text(`Distance: ${distance}km`, p.width / 2, p.height / 2 + 30);
      p.text(
        `Time alive: ${formatTimeInterval(endTime - startTime)}`,
        p.width / 2,
        p.height / 2 + 60
      );
      p.text(
        `Num missiles destroyed: ${numDestroyed}`,
        p.width / 2,
        p.height / 2 + 90
      );

      // play again
      p.text("Press space to play again", p.width / 2, p.height - 40);

      return;
    }

    // moving background to give illusion of upwards movement
    for (const star of stars) {
      star.update();
      star.show();
    }

    // player movement
    if (keysPressed.has("w")) player.up();
    if (keysPressed.has("a")) player.left();
    if (keysPressed.has("s")) player.down();
    if (keysPressed.has("d")) player.right();
    player.damp();

    // missile collision with player
    for (let i = missiles.length - 1; i >= 0; i--) {
      if (player.isIntersecting(missiles[i])) {
        missiles.splice(i, 1);
        player.helth -= 1;
      }
    }

    // flare collision with missile
    for (let i = missiles.length - 1; i >= 0; i--) {
      for (let j = player.flares.length - 1; j >= 0; j--) {
        const missile = missiles[i];
        const flare = player.flares[j];
        if (missile && flare && missile.isIntersecting(flare)) {
          numDestroyed++;
          missiles.splice(i, 1);
          player.flares.splice(j, 1);
        }
      }
    }

    // update player
    player.update();
    player.show();

    // update missiles
    for (const missile of missiles) {
      // choose a random flare within the radius to persue, if none then persues the player
      const choices: Flare[] = [];
      for (const flare of player.flares) {
        if (distSq(flare.pos, missile.pos) < missile.perceptionRadius ** 2) {
          choices.push(flare);
        }
      }
      if (choices.length == 0) {
        missile.pursue(player);
      } else {
        missile.pursue(p.random(choices));
      }

      missile.update();
      missile.show();
    }

    // add new missiles
    if (missiles.length < maxMissiles && Math.random() <= spawnRate) {
      missiles.push(new Missile(p, p.random(0, p.width), p.height));
    }

    // recharge flares
    if (p.frameCount % rechargeRate == 0) {
      player.rechargeFlare();
    }

    // shoot flares
    if (
      keysPressed.has("backspace") &&
      p.frameCount - lastFireFrame > flareFireRate
    ) {
      player.shootFlare();
      lastFireFrame = p.frameCount;
    }

    // health bar
    drawBar(player.helth, player.maxhealth, 0, "Health", p.color("brown"));

    // ammo bar
    drawBar(
      player.numFlaresLoaded,
      player.maxNumFlares,
      30,
      "Flares",
      p.color("green")
    );

    // show distance
    p.push();
    p.textSize(25);
    p.fill("white");
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Distance: ${distance}km`, 20, 90);
    p.pop();

    // check game over
    if (player.helth <= 0) {
      gameOver = true;
      endTime = Date.now();
    }

    distance += 1;

    // p.noLoop();
  };

  p.keyPressed = () => {
    const key = p.key.toLowerCase();
    if (ALLOWED_KEYS.includes(key)) keysPressed.add(key);
  };

  p.keyReleased = () => {
    if (p.key == " " && (gameOver || gameIntro)) {
      restartGame();
      return;
    }

    const key = p.key.toLowerCase();
    if (ALLOWED_KEYS.includes(key)) keysPressed.delete(key);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});

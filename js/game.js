'use strict';

// 描画領域の縦横幅(px)
const CANVAS_W = 400;
const CANVAS_H = 400;

// プレイヤー画像の描画領域上の初期表示位置(px)
const INIT_PLAYER_X = 80;
const INIT_PLAYER_Y = 80;

// ボール画像の画面領域上の初期表示位置(px)
const INIT_BALL_X = 200;
const INIT_BALL_Y = 200;

// スコア(100単位)
let score = 0;

// プレイヤークラス
class Player {
  constructor(img, x, y) {
    this.img = new Image();
    this.img.src = img;
    this.left = 0;      // 画像ファイルの指定場所(left)から画像抽出
    this.top = 0;       // 画像ファイルの指定場所(top)から画像抽出
    this.width = 40;    // 画像ファイルの指定場所(left)から指定幅(width)で画像抽出
    this.height = 40;   // 画像ファイルの指定場所(top)から指定幅(height)で画像抽出
    this.x = x;         // 描画領域上のX座標(px)を起点に描画
    this.y = y;         // 描画領域上のY座標(px)を起点に描画
    this.movement = 0;  // 移動量
  }
  move(keyCode) {
    switch(keyCode) {
      case 37:  // 左
        this.x -= 4;
        break;
      case 38:  // 上
        this.y -= 4;
        break;
      case 39:  // 右
        this.x += 4;
        break;
      case 40:  // 下
        this.y += 4;
        break;
    }
  }
}

// ボールクラス
class Ball {
  constructor(img, x, y) {
    this.img = new Image();
    this.img.src = img;
    this.left = 0;     // 画像ファイルの指定場所(left)から画像抽出
    this.top = 0;      // 画像ファイルの指定場所(top)から画像抽出
    this.width = 40;   // 画像ファイルの指定場所(left)から指定幅(width)で画像抽出
    this.height = 40;  // 画像ファイルの指定場所(top)から指定幅(height)で画像抽出
    this.x = x;        // 描画領域上のX座標(px)を起点に描画
    this.y = y;        // 描画領域上のY座標(px)を起点に描画
  }
  move() {
    let arrX = [ 120, 160, 200, 240, 280, 320 ];
    let arrY = [ 120, 160, 200, 240, 280, 320 ];
    let indX = arrX.indexOf(this.x);
    let indY = arrY.indexOf(this.y);
    if (indX !== -1) arrX.splice(indX, 1);
    if (indY !== -1) arrY.splice(indY, 1);
    this.x = arrX[ Math.floor( Math.random() * (arrX.length - 1) ) ];
    this.y = arrY[ Math.floor( Math.random() * (arrY.length - 1) ) ];
  }
}

// 入力キークラス
class Input {
  constructor() {
    this.left = false;
    this.up = false;
    this.right = false;
    this.down = false;
    this.pushed = '';   // 移動方向
  }
}

// ボール生成
let ball = new Ball('img/ball.png', INIT_BALL_X, INIT_BALL_Y);

// プレイヤー生成
let player = new Player('img/dog.png', INIT_PLAYER_X, INIT_PLAYER_Y);

// 入力キーオブジェクト生成
let input = new Input();

// 音声オブジェクト生成
let audio = new Audio('sound/poka.mp3');

// ゲームクラス
class Game {
  constructor() {
    this.width = CANVAS_W;
    this.height = CANVAS_H;
    this.objects = [ ball, player ];
  }
  draw() {
    let can = document.getElementById('can');
    can.width = this.width;
    can.height = this.height;
    
    let ctx = can.getContext('2d');
    ctx.font = "24px 'Hiragino Kaku Gothic Pro', 'MS Gothic', sans-serif";
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    ctx.strokeStyle = '#FFF';
    ctx.strokeRect(0, 0, CANVAS_W, 40);
    
    ctx.fillStyle = '#FFF';
    ctx.fillText(`SCORE: ${score}`, 10, 30);
    
    if (input.left || input.up || input.right || input.down) {
      player.movement = 40;
    }
    
    let tmpX = player.x;
    let tmpY = player.y;
    
    if (player.movement >= 0) {
      switch(input.pushed) {
        case 'left':
          if (tmpX - 4 >= 0) {
            player.move(37);
            player.movement -= 4;
          }
          break;
        case 'up':
          if (tmpY - 4 >= 40) {
            player.move(38);
            player.movement -= 4;
          }
          break;
        case 'right':
          if (tmpX + 4 < CANVAS_W - 40) {
            player.move(39);
            player.movement -= 4;
          }
          break;
        case 'down':
          if (tmpY + 4 < CANVAS_H - 40) {
            player.move(40);
            player.movement -= 4;
          }
          break;
      }
    }
    
    if ( player.x > ball.x - 25 &&
         player.x < ball.x + 25 &&
         player.y > ball.y - 25 &&
         player.y < ball.y + 25 ) {
      ball.move();
      score += 100;
      audio.volume = 0.5;
      audio.play();
    }
    
    for (let i = 0; i < this.objects.length; i++) {
      ctx.drawImage(
        this.objects[i].img,
        this.objects[i].left,    // 画像の指定場所(left)から抽出
        this.objects[i].top,     // 画像の指定場所(top)から抽出
        this.objects[i].width,   // 指定場所(left)から指定幅(width)で画像を抽出
        this.objects[i].height,  // 指定場所(top)から指定幅(height)で画像を抽出
        this.objects[i].x,       // 抽出画像を指定場所(X)から描画
        this.objects[i].y,       // 抽出画像を指定場所(Y)から描画
        this.objects[i].width,   // 指定場所(X)から指定幅(width)で描画
        this.objects[i].height   // 指定場所(Y)から指定幅(height)で描画
      );
    }
  }
}

// イベント処理
addEventListener('keydown', function(event) {
  switch(event.keyCode) {
    case 37:  // 左
      input.left = true;
      input.pushed = 'left';
      break;
    case 38:  // 上
      input.up = true
      input.pushed = 'up';
      break;
    case 39:  // 右
      input.right = true;
      input.pushed = 'right';
      break;
    case 40:  // 下
      input.down = true;
      input.pushed = 'down';
      break;
  }
  event.preventDefault();
}, false);

// イベント処理
addEventListener('keyup', function(event) {
  switch(event.keyCode) {
    case 37:  // 左
      input.left = false;
      break;
    case 38:  // 上
      input.up = false;
      break;
    case 39:  // 右
      input.right = false;
      break;
    case 40:  // 下
      input.down = false;
      break;
  }
}), false;

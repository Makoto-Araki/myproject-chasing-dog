'use strict';

// インスタンス生成
let game = new Game();

// メインループ
function main() {
  game.draw();
  requestAnimationFrame(main);
}

// メインループ開始
addEventListener('load', main(), false);

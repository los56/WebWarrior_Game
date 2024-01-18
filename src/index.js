import * as PIXI from 'pixi.js';
import Constants from './Constants';
import { GameUnit } from './Units';
import GameManager from './GameManager';

const spriteURL = Constants.ResourceURL + '/sprites';

class WWGame {
    gameManager;

    constructor() {
        this.gameManager = new GameManager("");
    }
}

const game = new WWGame();
game.gameManager.init();
game.gameManager.spawnEnemy(); 
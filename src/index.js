import Constants from './Constants';
import GameManager from './GameManager';

const spriteURL = Constants.ResourceURL + '/sprites';

class WWGame {
    gameManager;

    constructor() {
        this.gameManager = new GameManager("", {logging: true});
    }
}

//  Prevent showing context menu (Right click)
document.addEventListener('contextmenu', e => {
    e.preventDefault();
})

const game = new WWGame();
game.gameManager.spawnEnemy(); 
game.gameManager.logger.addLog('INIT');
game.gameManager.logger.addLog('WELCOME', ['테스터']);

setTimeout(() => {
    game.gameManager.warrior.moveTo(300, 300, 5, () => {
        setTimeout(() => {
            game.gameManager.warrior.moveTo(50, 300, 5);
        }, 500);
    }); 
}, 500);

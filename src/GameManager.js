import * as PIXI from 'pixi.js';
import { Goblin, GameUnit, Warrior } from './Units.js';

import AttackButton from './resources/sprites/Buttons/Attack.png';
import EscapeButton from './resources/sprites/Buttons/Empty.png';
import { GameButton } from './UI.js';

class GameManager {
    // Transfer
    sessionURL;

    // GameLogic
    isPlayerTurn = false;
    
    // GameObjects
    app;
    warrior;
    enemies = [];
    turnText;

    buttons = [];

    constructor(sessionURL) {
        this.sessionURL = sessionURL;
    }

    init() {
        this.initApp();
        this.spawnWarrior();
        this.drawTurnText();
        this.drawButton();
    }

    initApp() {
        this.app = new PIXI.Application({
            background: 'black',
            width: 500,
            height: 600
        });
        document.body.appendChild(this.app.view);
    }

    spawnWarrior() {
        this.warrior = new Warrior(this);

        this.warrior.draw();
        this.warrior.setPosition(50, 300);
        this.app.stage.addChild(this.warrior.container);
    }

    spawnEnemy() {
        const _e = new Goblin(this);
        this.enemies.push(_e);
         
        _e.draw();
        _e.setPosition(450, 300);
        _e.container.scale.set(-1.0, 1.0);
        this.app.stage.addChild(_e.container);
    }

    drawTurnText() {
        if(!this.turnText) {
            this.turnText = new PIXI.Text('', {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: '#FFFFFF',
                align: 'center'
            });
            this.app.stage.addChild(this.turnText);
            this.turnText.position.set(250, 25);
            this.turnText.anchor.set(0.5, 0.5);
        }

        this.turnText.text = `Turn: ${(this.isPlayerTurn ? 'Player' : 'Enemy')}`;
    }

    drawButton() {
        const atkbtn = new GameButton(AttackButton, 50, 550, () => {console.log('attack!')});
        atkbtn.draw();
        atkbtn.setScale(1.5, 1.5);
        this.buttons.push(atkbtn);

        const escapebtn = new GameButton(EscapeButton, 100, 550, () => {console.log('escape!')});
        escapebtn.draw();
        escapebtn.setScale(1.5, 1.5);
        this.buttons.push(escapebtn);

        for(let i of this.buttons) {
            this.app.stage.addChild(i.pixiContainer);
        }
    }
}

export default GameManager;
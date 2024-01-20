import * as PIXI from 'pixi.js';
import { Goblin, GameUnit, Warrior } from './Units.js';

import AttackButton from './resources/sprites/Buttons/Attack.png';
import EscapeButton from './resources/sprites/Buttons/Empty.png';
import { GameButton } from './UI.js';
import { GameLogger } from './Utils.js';

class GameManager {
    // Transfer
    sessionURL;

    // GameLogic
    turnCount = 1;
    isPlayerTurn = true;
    isSelectMode = false;
    
    // GameObjects
    app;
    warrior;
    enemies = [];
    turnText;

    buttons = [];

    // Utils
    logger;
    options;

    constructor(sessionURL, options) {
        this.sessionURL = sessionURL;
        this.options = options;
        this.init();
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
        document.getElementById('container').appendChild(this.app.view);

        this.app.stage.hitArea = new PIXI.Rectangle(0, 0, 500, 600);
        this.app.stage.eventMode = 'static';
        this.app.stage.onrightdown = (e) => {
            this.onClick(e);
        };

        console.log(this.options);

        if(this.options) {
            if(this.options.logging) {
                this.logger = new GameLogger(this);
            }
            
        }
    }

    onClick(e) {
        if(!this.isSelectMode) {
            return;
        }
        
        for(let i of this.enemies) {
            if(!i) {
                continue;
            }

            i.unsetSelectMode();
            console.log(i);
        }
        this.isSelectMode = false;
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
        const atkbtn = new GameButton(AttackButton, 50, 550, () => {this.attackMode()});
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

    attackMode() {
        if(this.isSelectMode) {
            return;
        }

        for(let i of this.enemies) {
            if(!i) {
                continue;
            }

            i.setSelectMode();
        }
        this.isSelectMode = true;
    }
}

export default GameManager;
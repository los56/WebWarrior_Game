import * as PIXI from "pixi.js";
import Constants from "./Constants"

import KnightImage from './resources/sprites/Knight/Idle.png';
import KnightAttackImage from './resources/sprites/Knight/Attack.png';
import KnightMoveImage from './resources/sprites/Knight/Run.png';

import GoblinImage from './resources/sprites/Goblin/Idle.png';

import GreenArrow from './resources/sprites/Arrows/Green.png';
import RedArrow from './resources/sprites/Arrows/Red.png';


import { GameMath, GameUtils } from "./Utils";

export const AnimationEnum = {
    Idle: 0,
    Attack: 1,
    Death: 2,
    Move: 3,
}

Object.freeze(AnimationEnum);

export class GameUnit {
    // Texture setting
    textureImage = [KnightImage];
    textures = [];
    textureFrames = [];

    // PIXI Container
    container;

    //PIXI Sprite;
    sprite;

    currentAnimation = AnimationEnum.Idle;
    frameWidth = 64;
    frameHeight = 64;
    animationSpeed = 0.15;
    position = {x: 0, y: 0}
    hp = 50;
    maxHp = 50;
    
    // Move
    isMoving = false;
    desirePosition = {x: 0, y: 0};
    moveSpeed = 2.0;
    moveDiffOffset = 0.0005;
    onCompleteMove;

    isSelectMode = false;
    arrowSprite;

    gameManager;

    onClick = () => {};

    // Indicator
    hpText;

    constructor(gameManager) {
        this.gameManager = gameManager;
    }
    
    draw() {
        this.container = new PIXI.Container();

        const loadPromise = [];

        for(let i = 0;i < this.textureImage.length;i++) {
            if(!this.textureImage[i]) {
                continue;
            }
            loadPromise[i] = (PIXI.Assets.load(this.textureImage[i]))
        }

        const pr = Promise.all(loadPromise).then(res => {
            for(let i = 0;i < loadPromise.length;i++) {
                if(!loadPromise[i]) {
                    continue;
                }
                
                this.textures[i] = res[i];
                this.sliceTexture(i);
            }

            this.sprite = new PIXI.AnimatedSprite(this.textureFrames[this.currentAnimation]);
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.animationSpeed = this.animationSpeed;
            this.sprite.play();
            this.sprite.onpointerdown = () => {this.onClickResolver()};
            this.sprite.eventMode = 'static';

            this.sprite.onpointerover = () => {console.log('over')};
            this.sprite.onpointerout = () => {console.log('out')};
    
            this.container.addChild(this.sprite);
            this.gameManager.app.ticker.add(() => {
                const deltaTime = this.gameManager.app.ticker.deltaTime;
                this.loop(deltaTime);
            });

            this.hpText = new PIXI.Text(`${this.hp}/${this.maxHp}`, {fill: 'white', fontSize: 12});
            this.hpText.anchor.set(0.5, 0.5);
            this.hpText.position.set(0, this.frameHeight / 3);
            this.container.addChild(this.hpText);
        });

        return pr;
    }

    loop(deltaTime) {
        if(this.isMoving) {
            this.deltaMove(deltaTime);
        }
    }

    sliceTexture(index) {
        const rect = new PIXI.Rectangle(0, 0, this.frameWidth, this.frameHeight)
        const temp = [];
        const maxX = this.textures[index].width;
        for(let i = 0;i < this.textures[index].width / this.frameWidth;i++) {
            const desireX = i * this.frameWidth;
            if(desireX + this.frameWidth > maxX) {
                rect.width = maxX - desireX;
            }
            console.log(rect.width);
            rect.x = desireX;
            temp.push(new PIXI.Texture(this.textures[index], rect));
        }
        this.textureFrames[index] = temp;
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.container.position.set(this.position.x, this.position.y);
    }

    playAnimation(target) {
        this.sprite.textures = this.textureFrames[target];
        this.currentAnimation = target;
        this.sprite.loop = false;
        this.sprite.play();

        this.sprite.onComplete = () => {
            this.playAnimationInfinite(AnimationEnum.Idle)
        }
    }

    playAnimationInfinite(target) {
        this.sprite.textures = this.textureFrames[target];
        this.currentAnimation = target;
        this.sprite.loop = true;
        this.sprite.play();
    }

    moveTo(x, y, speed, complete) {
        this.isMoving = true;
        this.desirePosition = {x: x, y: y};
        this.moveSpeed = speed;
        this.playAnimationInfinite(AnimationEnum.Move);

        this.onCompleteMove = complete;
    }   

    deltaMove(deltaTime) {
        const target = GameMath.getDeltaPosition(this.position.x, this.position.y, this.desirePosition.x, this.desirePosition.y, this.moveSpeed * deltaTime);
        console.log(target);
        this.setPosition(target.x, target.y);
        
        if(target.finish) {
            this.isMoving = false;
            this.playAnimationInfinite(AnimationEnum.Idle);
            if(this.onCompleteMove) {
                this.onCompleteMove();
            }
        }
    }

    onClickResolver() {
        if(!this.isSelectMode) {
            return;
        }

        this.isSelectMode = false;
        this.onClick();
    }

    showArrow(color) {
        const arrowImage = (color == 'red') ? RedArrow : GreenArrow;
        if(this.arrowSprite) {
            this.container.removeChild(this.arrowSprite);
        }

        PIXI.Assets.load(arrowImage).then(tex => {
            this.arrowSprite = new PIXI.Sprite(tex);
            this.arrowSprite.anchor.set(0.5, 0.5);
            this.arrowSprite.position.set(0, -30);
            this.container.addChild(this.arrowSprite);
        });
    }

    setSelectMode(onClick) {
        this.isSelectMode = true;
        this.onClick = onClick;

        this.showArrow();
    }

    unsetSelectMode() {
        this.isSelectMode = false;
        if(this.arrowSprite) {
            this.container.removeChild(this.arrowSprite);
            this.arrowSprite.destroy();
        }
    }

    getSprite() {
        return this.sprite;
    }
}

export class Warrior extends GameUnit {
    textureImage = [KnightImage, KnightAttackImage, ,KnightMoveImage];
}

export class EnemyUnit extends GameUnit {
    textureImage = [GoblinImage];

    frameHeight = 150; 
    frameWidth = 150;

    draw() {
        const pr = super.draw();
        pr.then(() => {
            this.sprite.scale.set(-1.0, 1.0);
        });
    }
}

export class Goblin extends EnemyUnit {
    textureImage = [GoblinImage];

    frameHeight = 150; 
    frameWidth = 150;
}
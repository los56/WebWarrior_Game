import * as PIXI from "pixi.js";
import Constants from "./Constants"

import KnightImage from './resources/sprites/Knight/Idle.png';
import KnightAttackImage from './resources/sprites/Knight/Attack.png';

import GoblinImage from './resources/sprites/Goblin/Idle.png';

import GreenArrow from './resources/sprites/Arrows/Green.png';
import RedArrow from './resources/sprites/Arrows/Red.png';


import { GameUtils } from "./Utils";

export const AnimationEnum = {
    Idle: 0,
    Attack: 1,
    Death: 2
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
    
    isMoving = false;
    desirePosition = {x: 0, y: 0};
    moveSpeed = 2.0;

    isSelectMode = false;
    arrowSprite;

    gameManager;

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

        Promise.all(loadPromise).then(res => {
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
            this.sprite.onpointerdown = () => {this.onClick()};
            this.sprite.eventMode = 'static';
    
            this.container.addChild(this.sprite);
            this.gameManager.app.ticker.add(() => {
                const deltaTime = this.gameManager.app.ticker.deltaTime;
            })
        });
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

    onClick() {
        console.log(`Clicked: ${this.constructor.name}`);
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
            this.currentAnimation = AnimationEnum.Idle;
            this.sprite.textures = this.textureFrames[this.currentAnimation];
            this.sprite.loop = true;
            this.sprite.play();
        }
    }

    moveTo(x, y, speed) {

    }  

    showArrow(color) {
        const arrowImage = (color == 'red') ? RedArrow : GreenArrow;
        PIXI.Assets.load(arrowImage).then(tex => {
            this.arrowSprite = new PIXI.Sprite(tex);
            this.container.addChild(this.arrowSprite);
        })

    }
}

export class Warrior extends GameUnit {
    textureImage = [KnightImage, KnightAttackImage];
}

export class Goblin extends GameUnit {
    textureImage = [GoblinImage];

    frameHeight = 150; 
    frameWidth = 150;
}
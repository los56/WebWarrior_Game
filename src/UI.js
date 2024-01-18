import * as PIXI from 'pixi.js';

export class GameText {
    pixiText;

    constructor(text, position) {

    }
}

export class GameButton {
    pixiContainer;
    pixiSprite;
    textOrTexture;
    
    texture;
    bottomText;
    onClick;
    position = {x: 0, y: 0}

    constructor(textOrTexture, x, y, onClick) {
        this.textOrTexture = textOrTexture;
        this.position.x = x;
        this.position.y = y;
        this.onClick = onClick;
    }

    draw() {
        this.pixiContainer = new PIXI.Container();
        
        // if(typeof(textOrTexture) == 'string') {
        //     this.pixiSprite = new PIXI.Text(textOrTexture);
        // } else {
            
        // }

        PIXI.Assets.load(this.textOrTexture).then(res => {
            this.texture = res;
            this.pixiSprite = new PIXI.Sprite(this.texture);
            this.pixiSprite.anchor.set(0.5, 0.5);

            this.pixiSprite.eventMode = 'static';
            this.pixiSprite.onpointerdown = () => {this.onClick()};
            
            this.pixiContainer.addChild(this.pixiSprite);
            this.pixiContainer.position.set(this.position.x, this.position.y);    
        });
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        
        this.pixiContainer.position.set(x, y);
    }

    setScale(x, y) {
        this.pixiContainer.scale.set(x, y);
    }
}
import GameScripts from "./GameText";

export class GameMath {
    static getDistance(x1, y1, x2, y2) {
        const _x = x2 - x1;
        const _y = y2 - y1;

        const _len = Math.sqrt(_x * _x + _y * _y);

        return _len;
    }

    static getDeltaPosition(x, y, desireX, desireY, speed) {
        const _len = GameMath.getDistance(x, y, desireX, desireY);

        if(_len <= speed) {
            return {x: desireX, y: desireY, finish: true};
        }

        const _hLen = (desireX - x) * (desireX - x);
        console.log(_hLen);

        const _rad = Math.acos(_hLen / _len);
        let _targetX = x + Math.cos(_rad) * speed;
        let _targetY = y + Math.sin(_rad) * speed;

        return {x: _targetX, y: _targetY, finish: false};
    }
}

export class GameLogger {
    gameManager

    logDiv;

    constructor(gameManager) {
        this.logDiv = document.createElement('ul');
        document.getElementById('container').appendChild(this.logDiv);
    }

    addLog(str, args) {
        const _temp = document.createElement('li');
        _temp.textContent = this.formatting(GameScripts.Log[str], args);

        this.logDiv.appendChild(_temp);
    }

    formatting(str, args) {
        const strArray = str.split('%s');
        let res = strArray[0]

        for(let i = 1;i < strArray.length;i++) {
            res += `${args[i - 1]}${strArray[i]}`;
        }

        return res;
    }
}
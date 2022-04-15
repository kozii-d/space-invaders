import {Spaceship} from "./spaceship";
import {Alien} from "./alien";
import {Block} from "./block";

export class Game {
    static FPS = 60;
    static GAME_HEIGHT = 500;
    static GAME_WIDTH = 1000;

    spaceship = null
    aliens = [];
    shots = [];

    isReverse = false;

    keyState = {
        ArrowLeft: false,
        ArrowRight: false,
        ' ': false // space key
    };

    constructor() {
        this.create();
        this.spaceship = new Spaceship();
        this.spawnAliens();
        this.addEvents();
        this.updateLoop();
        this.moveAliens();
    }

    create() {
        const game = document.createElement('main');
        game.classList.add('game-field');
        game.style.height = Game.GAME_HEIGHT + 'px';
        game.style.width = Game.GAME_WIDTH + 'px';

        document.body.appendChild(game);

        return game;
    }

    updateLoop() {
        setInterval(() => {
            if (this.keyState.ArrowLeft) {
                this.spaceship.move('moveLeft');
            }
            if (this.keyState.ArrowRight) {
                this.spaceship.move('moveRight');
            }
            if (this.keyState[' ']) {
                const shot = this.spaceship.shot();
                shot && this.shots.push(shot);
            }

            this.checkShots();

        }, 1000 / Game.FPS);
    }

    addEvents() {
        document.addEventListener('keydown', e => {
            this.keyState[e.key] = true;
        });

        document.addEventListener('keyup', e => {
            this.keyState[e.key] = false;
        });
    }

    checkShots() {
        this.shots.forEach(shot => {
            if (shot.isOutOfField) {
                shot.node.remove();
            }
        });
        this.shots = this.shots.filter(shot => !shot.isOutOfField);
    }

    spawnAliens() {
        const gameField = document.querySelector('.game-field');
        const aliansArea = document.createElement('div');
        aliansArea.classList.add('aliens-area');
        gameField.appendChild(aliansArea);

        for (let height = Block.BLOCK_SIZE, width = Block.BLOCK_SIZE; height < Game.GAME_HEIGHT / 100 * 40;) {
            if (width > Game.GAME_WIDTH / 100 * 60) {
                height += Alien.ALIEN_HEIGHT_IN_BLOCK * Block.BLOCK_SIZE + Block.BLOCK_SIZE;
                width = Block.BLOCK_SIZE;
            }
            this.aliens.push(new Alien(width, height));
            width += Alien.ALIEN_WIDTH_IN_BLOCK * Block.BLOCK_SIZE + Block.BLOCK_SIZE;
        }
        // todo: исправить костыль
        this.aliens.pop().node.remove();
    }

    moveAliens () {
        setInterval(() => {
            this.aliens.forEach(alien => {
                if (alien.x > Game.GAME_WIDTH - (Block.BLOCK_SIZE * 6)) {
                    this.isReverse = true;
                }

                if (alien.x < Block.BLOCK_SIZE) {
                    this.isReverse = false;
                }

                if (this.isReverse) {
                    alien.x -= Block.BLOCK_SIZE;
                    alien.draw();

                } else {
                    alien.x += Block.BLOCK_SIZE;
                    alien.draw();

                }
            })
        }, 500);
    }
}
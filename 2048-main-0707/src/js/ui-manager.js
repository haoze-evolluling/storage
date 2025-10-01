// UI管理和背景控制类
class UIManager {
    constructor() {
        // 背景图片
        this.backgroundImages = [
            'pic/back (1).png',
            'pic/back (2).png',
            'pic/back (3).png',
            'pic/back (4).png',
            'pic/back (5).png',
            'pic/back (6).png',
            'pic/back (7).png',
            'pic/Star_Rail.png'
        ];
        this.currentBackground = 0;
        
        // DOM 元素
        this.gameBoard = document.querySelector('.game-board');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.gameVictoryElement = document.getElementById('game-victory');
        this.victoryScoreElement = document.getElementById('victory-score');
        this.continueGameButton = document.getElementById('continue-game');
        this.newGameVictoryButton = document.getElementById('new-game-victory');
        this.newGameButton = document.getElementById('new-game');
        this.retryButton = document.getElementById('retry');
        this.undoButton = document.getElementById('undo-button');
        this.backgroundContainer = document.querySelector('.background-container');
        this.backgroundOptions = document.querySelector('.background-options');
        this.gameTitle = document.getElementById('game-title');
        this.backgroundModal = document.getElementById('background-modal');
        this.closeModalButton = document.querySelector('.close-modal');
        
        // 触摸事件变量
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
    }

    // 初始化UI
    initializeUI() {
        // 清空游戏板
        this.gameBoard.innerHTML = '';
        
        // 创建初始网格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.id = `tile-${i}-${j}`;
                this.gameBoard.appendChild(tile);
            }
        }
        
        // 隐藏游戏结束界面和胜利界面
        this.gameOverElement.style.display = 'none';
        this.gameVictoryElement.style.display = 'none';

        // 添加游戏板加载动画
        this.gameBoard.classList.add('board-load');
        setTimeout(() => {
            this.gameBoard.classList.remove('board-load');
        }, 600);

        // 为每个方块添加延迟出现动画
        const tiles = this.gameBoard.querySelectorAll('.tile');
        tiles.forEach((tile, index) => {
            tile.style.opacity = '0';
            tile.style.transform = 'scale(0)';
            setTimeout(() => {
                tile.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                tile.style.opacity = '1';
                tile.style.transform = 'scale(1)';
            }, index * 30);
        });
    }

    // 初始化背景选择器
    initializeBackgroundSelector() {
        // 清空背景选项
        this.backgroundOptions.innerHTML = '';
        
        // 创建背景选项
        this.backgroundImages.forEach((bgImage, index) => {
            const option = document.createElement('div');
            option.className = 'background-option';
            if (index === this.currentBackground) {
                option.classList.add('active');
            }
            
            const img = document.createElement('img');
            img.src = bgImage;
            img.alt = `背景 ${index + 1}`;
            
            option.appendChild(img);
            option.addEventListener('click', () => {
                this.setBackground(index);
                this.closeBackgroundModal();
            });
            
            this.backgroundOptions.appendChild(option);
        });
        
        // 设置初始背景
        this.loadSavedBackground();
        
        // 添加标题点击事件和特效
        this.gameTitle.addEventListener('click', () => {
            this.addTitleClickEffect();
            this.openBackgroundModal();
        });

        // 添加标题右键点击事件（直接胜利）
        this.gameTitle.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // 阻止默认右键菜单
            this.handleTitleRightClick();
        });
        
        // 添加关闭按钮事件
        this.closeModalButton.addEventListener('click', () => this.closeBackgroundModal());
        
        // 点击模态框外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === this.backgroundModal) {
                this.closeBackgroundModal();
            }
        });
        
        // 为所有按钮添加点击效果
        this.addButtonEffects();
    }

    // 为所有按钮添加点击效果
    addButtonEffects() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // 添加波纹效果类
            button.classList.add('btn-ripple');

            // 点击反馈效果
            button.addEventListener('mousedown', (e) => {
                button.classList.add('clicked');
                this.createRippleEffect(button, e);
            });

            button.addEventListener('mouseup', () => {
                button.classList.remove('clicked');
            });

            button.addEventListener('mouseleave', () => {
                button.classList.remove('clicked');
            });

            // 添加悬浮时的脉冲效果（仅对主要按钮）
            if (button.id === 'new-game') {
                button.addEventListener('mouseenter', () => {
                    button.classList.add('btn-pulse');
                });

                button.addEventListener('mouseleave', () => {
                    button.classList.remove('btn-pulse');
                });
            }
        });
    }

    // 创建波纹效果
    createRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
        `;

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // 添加标题点击效果
    addTitleClickEffect() {
        this.gameTitle.style.transform = 'scale(0.9) rotate(-2deg)';
        this.gameTitle.style.textShadow = '0 0 20px rgba(21, 101, 192, 0.8)';

        setTimeout(() => {
            this.gameTitle.style.transform = '';
            this.gameTitle.style.textShadow = '';
        }, 200);
    }

    // 处理标题右键点击（直接胜利）
    handleTitleRightClick() {
        // 添加特殊的右键点击效果
        this.gameTitle.style.transform = 'scale(1.1) rotate(5deg)';
        this.gameTitle.style.textShadow = '0 0 30px rgba(255, 215, 0, 1)';
        this.gameTitle.style.color = '#FFD700';

        setTimeout(() => {
            this.gameTitle.style.transform = '';
            this.gameTitle.style.textShadow = '';
            this.gameTitle.style.color = '';
        }, 300);

        // 触发自定义事件，通知主控制器执行强制胜利
        const forceWinEvent = new CustomEvent('forceWin');
        document.dispatchEvent(forceWinEvent);
    }

    // 打开背景选择模态框 - 移除动画效果
    openBackgroundModal() {
        this.backgroundModal.style.display = 'flex';
    }

    // 关闭背景选择模态框 - 移除动画效果
    closeBackgroundModal() {
        this.backgroundModal.style.display = 'none';
    }

    // 设置背景
    setBackground(index) {
        // 更新当前背景索引
        this.currentBackground = index;
        
        // 更新背景图片
        this.backgroundContainer.style.backgroundImage = `url('${this.backgroundImages[index]}')`;
        
        // 更新活动状态
        const options = document.querySelectorAll('.background-option');
        options.forEach((option, i) => {
            if (i === index) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // 保存背景选择
        localStorage.setItem('background2048', index);
    }

    // 加载保存的背景
    loadSavedBackground() {
        const savedBackground = localStorage.getItem('background2048');
        if (savedBackground !== null) {
            this.currentBackground = parseInt(savedBackground);
        }
        
        // 设置背景
        this.backgroundContainer.style.backgroundImage = `url('${this.backgroundImages[this.currentBackground]}')`;
        
        // 更新活动状态
        const options = document.querySelectorAll('.background-option');
        if (options.length > 0) {
            options.forEach((option, i) => {
                if (i === this.currentBackground) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    }

    // 更新UI
    updateUI(grid) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tile = document.getElementById(`tile-${i}-${j}`);
                const value = grid[i][j];
                const oldValue = tile.textContent;

                // 更新方块的内容和样式
                tile.textContent = value !== 0 ? value : '';
                tile.className = 'tile';

                if (value !== 0) {
                    tile.classList.add(`tile-${value}`);

                    // 添加方块点击效果
                    this.addTileClickEffect(tile);

                    // 移除方块更新动画效果
                }
            }
        }
    }

    // 为方块添加点击效果
    addTileClickEffect(tile) {
        // 移除之前的事件监听器（如果存在）
        tile.removeEventListener('click', tile.clickHandler);

        // 创建新的点击处理器
        tile.clickHandler = () => {
            if (tile.textContent !== '') {
                this.createTileClickAnimation(tile);
                this.showScoreParticle(tile);
            }
        };

        // 添加点击事件监听器
        tile.addEventListener('click', tile.clickHandler);
    }

    // 创建方块点击动画
    createTileClickAnimation(tile) {
        tile.style.transform = 'scale(0.9) rotate(5deg)';
        tile.style.boxShadow = '0 0 20px rgba(255, 235, 59, 0.8)';

        setTimeout(() => {
            tile.style.transform = '';
            tile.style.boxShadow = '';
        }, 150);
    }

    // 显示分数粒子效果
    showScoreParticle(tile) {
        const value = parseInt(tile.textContent);
        if (value >= 4) {
            const particle = document.createElement('div');
            particle.className = 'score-particle';
            particle.textContent = `+${value}`;

            const rect = tile.getBoundingClientRect();
            const containerRect = this.gameBoard.getBoundingClientRect();

            particle.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top - containerRect.top}px`;

            this.gameBoard.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    // 更新分数
    updateScore(score, bestScore) {
        const oldScore = parseInt(this.scoreElement.textContent);
        const scoreDiff = score - oldScore;

        this.scoreElement.textContent = score;

        // 添加分数变化动画
        if (score > oldScore) {
            this.scoreElement.classList.add('score-change');

            // 显示分数增加的数字动画
            this.showScoreIncrease(scoreDiff);

            setTimeout(() => {
                this.scoreElement.classList.remove('score-change');
            }, 800);
        }

        // 更新最高分
        const oldBestScore = parseInt(this.bestScoreElement.textContent);
        this.bestScoreElement.textContent = bestScore;

        // 如果最高分更新，添加特殊效果
        if (bestScore > oldBestScore) {
            this.bestScoreElement.classList.add('score-change');
            this.showBestScoreFireworks();
            setTimeout(() => {
                this.bestScoreElement.classList.remove('score-change');
            }, 800);
        }
    }

    // 显示分数增加动画
    showScoreIncrease(increase) {
        const scoreBox = this.scoreElement.parentElement;
        const increaseElement = document.createElement('div');
        increaseElement.className = 'score-increase';
        increaseElement.textContent = `+${increase}`;
        increaseElement.style.cssText = `
            position: absolute;
            top: -10px;
            right: 10px;
            color: #4CAF50;
            font-weight: bold;
            font-size: 14px;
            opacity: 1;
            transform: translateY(0);
            transition: all 0.8s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        scoreBox.style.position = 'relative';
        scoreBox.appendChild(increaseElement);

        // 触发动画
        setTimeout(() => {
            increaseElement.style.opacity = '0';
            increaseElement.style.transform = 'translateY(-30px)';
        }, 100);

        setTimeout(() => {
            increaseElement.remove();
        }, 900);
    }

    // 显示最高分烟花效果
    showBestScoreFireworks() {
        const bestScoreBox = this.bestScoreElement.parentElement;

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #FFD700;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: firework 1s ease-out forwards;
                    --angle: ${i * 60}deg;
                `;

                bestScoreBox.appendChild(firework);

                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }, i * 100);
        }
    }

    // 更新撤销按钮状态
    updateUndoButton(canUndo, undoCount = 0) {
        if (this.undoButton) {
            this.undoButton.disabled = !canUndo;
            if (canUndo) {
                this.undoButton.classList.remove('disabled');
                // 显示剩余撤销次数
                this.undoButton.innerHTML = `撤销 (${undoCount})`;
            } else {
                this.undoButton.classList.add('disabled');
                // 如果没有撤销次数，显示0
                this.undoButton.innerHTML = undoCount > 0 ? `撤销 (${undoCount})` : '撤销 (0)';
            }
        }
    }

    // 显示撤销动画效果 - 移除彩色滤镜效果
    showUndoAnimation() {
        // 撤销动画已移除
    }

    // 显示最高分更新动画
    showBestScoreUpdate() {
        this.bestScoreElement.classList.add('score-change');
        setTimeout(() => {
            this.bestScoreElement.classList.remove('score-change');
        }, 600);
    }

    // 显示新方块动画
    showNewTileAnimation(position) {
        setTimeout(() => {
            const tile = document.getElementById(`tile-${position.row}-${position.col}`);
            if (tile) {
                tile.classList.add('tile-new');
                setTimeout(() => {
                    tile.classList.remove('tile-new');
                }, 200);
            }
        }, 10);
    }

    // 显示合并动画
    showMergeAnimation(mergedTiles) {
        mergedTiles.forEach(position => {
            setTimeout(() => {
                const tile = document.getElementById(`tile-${position.row}-${position.col}`);
                if (tile) {
                    tile.classList.add('tile-merged');
                    setTimeout(() => {
                        tile.classList.remove('tile-merged');
                    }, 300);
                }
            }, 10);
        });
    }

    // 显示无效移动动画
    showInvalidMoveAnimation() {
        this.gameBoard.classList.add('shake');
        setTimeout(() => {
            this.gameBoard.classList.remove('shake');
        }, 500);
    }

    // 显示游戏结束界面
    showGameOver(finalScore) {
        setTimeout(() => {
            this.gameOverElement.style.display = 'flex';
            this.finalScoreElement.textContent = finalScore;
        }, 500);
    }

    // 显示胜利界面
    showVictory(score) {
        // 显示烟花动画
        this.showFireworks();

        setTimeout(() => {
            this.gameVictoryElement.style.display = 'flex';
            this.victoryScoreElement.textContent = score;
        }, 300);
    }

    // 隐藏胜利界面
    hideVictory() {
        this.gameVictoryElement.style.display = 'none';
    }

    // 显示烟花动画
    showFireworks() {
        const fireworksContainer = document.createElement('div');
        fireworksContainer.className = 'fireworks';
        document.body.appendChild(fireworksContainer);

        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

        // 创建多个烟花
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createFirework(fireworksContainer, colors);
            }, i * 200);
        }

        // 5秒后移除烟花容器
        setTimeout(() => {
            if (fireworksContainer.parentNode) {
                fireworksContainer.parentNode.removeChild(fireworksContainer);
            }
        }, 5000);
    }

    // 创建单个烟花
    createFirework(container, colors) {
        const firework = document.createElement('div');
        firework.className = `firework firework-${colors[Math.floor(Math.random() * colors.length)]}`;

        // 随机位置
        firework.style.left = Math.random() * 100 + '%';

        container.appendChild(firework);

        // 烟花爆炸效果
        setTimeout(() => {
            this.createFireworkParticles(container, firework, colors);
            firework.remove();
        }, 750);
    }

    // 创建烟花粒子
    createFireworkParticles(container, firework, colors) {
        const rect = firework.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 创建多个粒子
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = `firework-particle firework-${colors[Math.floor(Math.random() * colors.length)]}`;

            const angle = (i / 12) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');

            container.appendChild(particle);

            // 1秒后移除粒子
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    // 检查背景模态框是否打开
    isBackgroundModalOpen() {
        return this.backgroundModal.style.display === 'flex';
    }

    // 设置触摸事件监听器
    setupTouchEvents(onSwipe) {
        document.addEventListener('touchstart', (event) => {
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
        });

        document.addEventListener('touchmove', (event) => {
            this.touchEndX = event.touches[0].clientX;
            this.touchEndY = event.touches[0].clientY;
        });

        document.addEventListener('touchend', () => {
            // 如果背景选择模态框打开，则不处理游戏操作
            if (this.isBackgroundModalOpen()) return;
            
            const deltaX = this.touchEndX - this.touchStartX;
            const deltaY = this.touchEndY - this.touchStartY;
            
            // 最小滑动距离，防止误触
            const minSwipeDistance = 30;
            
            let direction = null;
            
            // 检测滑动方向
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                // 水平滑动
                direction = deltaX > 0 ? 'right' : 'left';
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
                // 垂直滑动
                direction = deltaY > 0 ? 'down' : 'up';
            }
            
            if (direction) {
                onSwipe(direction);
            }
        });
    }
}

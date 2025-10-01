// 游戏核心逻辑和UI管理模块已通过script标签加载

// 全局游戏实例
let game;
let uiManager;

// 初始化游戏
function initializeGame() {
    // 初始化游戏核心逻辑
    const gameState = game.initializeGame();

    // 初始化UI
    uiManager.initializeUI();
    uiManager.updateUI(gameState.grid);
    uiManager.updateScore(gameState.score, gameState.bestScore);
    uiManager.updateUndoButton(gameState.canUndo, gameState.undoCount);
}

// 处理撤销操作
function handleUndo() {
    if (game.isGameOver) return;

    const undoSuccess = game.undo();
    if (undoSuccess) {
        // 更新UI
        const gameState = game.getGameState();
        uiManager.updateUI(gameState.grid);
        uiManager.updateScore(gameState.score, gameState.bestScore);
        uiManager.updateUndoButton(gameState.canUndo, gameState.undoCount);

        // 显示撤销动画
        uiManager.showUndoAnimation();
    }
}

// 处理继续游戏操作
function handleContinueGame() {
    uiManager.hideVictory();
}

// 处理键盘事件
function handleKeyPress(event) {
    if (game.isGameOver) return;

    // 如果背景选择模态框打开，则不处理游戏操作
    if (uiManager.isBackgroundModalOpen()) {
        if (event.key === 'Escape') {
            uiManager.closeBackgroundModal();
        }
        return;
    }

    // 处理撤销快捷键 (Ctrl+Z 或 Cmd+Z)
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        handleUndo();
        return;
    }

    let moveResult = null;

    switch (event.key) {
        case 'ArrowUp':
            game.saveCurrentState();
            moveResult = game.moveUp();
            break;
        case 'ArrowDown':
            game.saveCurrentState();
            moveResult = game.moveDown();
            break;
        case 'ArrowLeft':
            game.saveCurrentState();
            moveResult = game.moveLeft();
            break;
        case 'ArrowRight':
            game.saveCurrentState();
            moveResult = game.moveRight();
            break;
        case 'Escape':
            uiManager.closeBackgroundModal();
            return;
        default:
            return;
    }

    handleMoveResult(moveResult);
}

// 处理移动结果
function handleMoveResult(moveResult) {
    if (moveResult.moved) {
        // 显示合并动画
        if (moveResult.mergedTiles.length > 0) {
            uiManager.showMergeAnimation(moveResult.mergedTiles);
        }

        // 生成新方块
        const newTilePosition = game.generateNewTile();
        if (newTilePosition) {
            uiManager.showNewTileAnimation(newTilePosition);
        }

        // 更新UI
        const gameState = game.getGameState();
        uiManager.updateUI(gameState.grid);

        // 更新分数
        const bestScoreUpdated = game.updateBestScore();
        uiManager.updateScore(gameState.score, gameState.bestScore);
        if (bestScoreUpdated) {
            uiManager.showBestScoreUpdate();
        }

        // 更新撤销按钮状态
        uiManager.updateUndoButton(gameState.canUndo, gameState.undoCount);

        // 检查是否胜利
        if (game.checkWin()) {
            uiManager.showVictory(gameState.score);
            return; // 胜利后不检查游戏结束
        }

        // 检查游戏是否结束
        if (!game.canMove()) {
            const gameOverResult = game.gameOver();
            uiManager.showGameOver(gameOverResult.finalScore);
        }
    } else {
        // 无效移动时添加震动效果，并清除保存的状态
        game.previousState = null;
        game.canUndo = false;
        uiManager.updateUndoButton(false, game.undoCount);
        uiManager.showInvalidMoveAnimation();
    }
}

// 处理滑动事件
function handleSwipe(direction) {
    if (game.isGameOver) return;

    // 在移动前保存状态
    game.saveCurrentState();

    let moveResult = null;

    switch (direction) {
        case 'up':
            moveResult = game.moveUp();
            break;
        case 'down':
            moveResult = game.moveDown();
            break;
        case 'left':
            moveResult = game.moveLeft();
            break;
        case 'right':
            moveResult = game.moveRight();
            break;
    }

    if (moveResult) {
        handleMoveResult(moveResult);
    }
}

// 处理强制胜利
function handleForceWin() {
    if (game.isGameOver || game.isWon) return; // 游戏已结束或已胜利，不处理

    // 调用游戏核心的强制胜利方法
    const winResult = game.forceWin();

    if (winResult) {
        // 更新UI显示新的2048方块
        const gameState = game.getGameState();
        uiManager.updateUI(gameState.grid);

        // 显示胜利界面
        uiManager.showVictory(gameState.score);
    }
}

// 事件监听器设置
function setupEventListeners() {
    // 键盘事件
    document.addEventListener('keydown', handleKeyPress);

    // 强制胜利事件（右键点击标题）
    document.addEventListener('forceWin', handleForceWin);

    // 按钮事件
    const newGameButton = document.getElementById('new-game');
    const retryButton = document.getElementById('retry');
    const undoButton = document.getElementById('undo-button');
    const continueGameButton = document.getElementById('continue-game');
    const newGameVictoryButton = document.getElementById('new-game-victory');

    newGameButton.addEventListener('click', initializeGame);
    retryButton.addEventListener('click', initializeGame);
    undoButton.addEventListener('click', handleUndo);
    continueGameButton.addEventListener('click', handleContinueGame);
    newGameVictoryButton.addEventListener('click', initializeGame);

    // 触摸滑动事件
    uiManager.setupTouchEvents(handleSwipe);
}

// 游戏初始化
window.onload = function() {
    // 创建游戏实例
    game = new Game2048();
    uiManager = new UIManager();

    // 初始化游戏
    initializeGame();

    // 初始化背景选择器
    uiManager.initializeBackgroundSelector();

    // 设置事件监听器
    setupEventListeners();
};


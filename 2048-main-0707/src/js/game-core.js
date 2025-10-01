// 2048游戏核心逻辑类
class Game2048 {
    constructor() {
        this.GRID_SIZE = 4;
        this.EMPTY_CELL = 0;
        this.grid = [];
        this.score = 0;
        this.bestScore = 0;
        this.isGameOver = false;
        this.isWon = false;

        // 撤销功能相关属性
        this.previousState = null;
        this.canUndo = false;
        this.undoCount = 3; // 增加撤销次数限制

        this.loadBestScore();
    }

    // 初始化游戏
    initializeGame() {
        // 重置游戏状态
        this.grid = Array(this.GRID_SIZE).fill().map(() => Array(this.GRID_SIZE).fill(this.EMPTY_CELL));
        this.score = 0;
        this.isGameOver = false;
        this.isWon = false;

        // 重置撤销相关状态
        this.previousState = null;
        this.canUndo = false;
        this.undoCount = 3; // 重置撤销次数

        // 生成三个初始方块，而不是两个
        this.generateNewTile();
        this.generateNewTile();
        this.generateNewTile();

        return {
            grid: this.grid,
            score: this.score,
            bestScore: this.bestScore,
            isGameOver: this.isGameOver,
            isWon: this.isWon,
            canUndo: this.canUndo,
            undoCount: this.undoCount
        };
    }

    // 生成一个新方块
    generateNewTile() {
        // 获取所有空位置
        const emptyCells = [];
        
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                if (this.grid[i][j] === this.EMPTY_CELL) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        // 如果没有空位，则退出
        if (emptyCells.length === 0) return false;
        
        // 随机选择一个空位
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        
        // 95%的概率生成2，5%的概率生成4
        this.grid[randomCell.row][randomCell.col] = Math.random() < 0.95 ? 2 : 4;
        
        return { row: randomCell.row, col: randomCell.col };
    }

    // 向左移动
    moveLeft() {
        let moved = false;
        const mergedTiles = [];
        
        for (let i = 0; i < this.GRID_SIZE; i++) {
            const originalRow = [...this.grid[i]];
            const row = this.grid[i].filter(cell => cell !== this.EMPTY_CELL);
            
            // 合并相同的方块
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    row[j + 1] = this.EMPTY_CELL;
                    this.score += row[j];
                    mergedTiles.push({ row: i, col: j });
                    j++;
                }
            }
            
            // 再次过滤掉空单元格并填充剩余空间
            const newRow = row.filter(cell => cell !== this.EMPTY_CELL);
            while (newRow.length < this.GRID_SIZE) {
                newRow.push(this.EMPTY_CELL);
            }
            
            // 更新网格
            this.grid[i] = newRow;
            
            // 检查是否有移动
            if (!moved && !this.arraysEqual(originalRow, newRow)) {
                moved = true;
            }
        }
        
        return { moved, mergedTiles };
    }

    // 向右移动
    moveRight() {
        let moved = false;
        const mergedTiles = [];
        
        for (let i = 0; i < this.GRID_SIZE; i++) {
            const originalRow = [...this.grid[i]];
            const row = this.grid[i].filter(cell => cell !== this.EMPTY_CELL);
            
            // 合并相同的方块
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    row[j - 1] = this.EMPTY_CELL;
                    this.score += row[j];
                    
                    // 计算在网格中的实际位置
                    const actualJ = this.GRID_SIZE - row.filter(cell => cell !== this.EMPTY_CELL).length + j;
                    mergedTiles.push({ row: i, col: actualJ });
                    j--;
                }
            }
            
            // 再次过滤掉空单元格并填充剩余空间
            const newRow = row.filter(cell => cell !== this.EMPTY_CELL);
            while (newRow.length < this.GRID_SIZE) {
                newRow.unshift(this.EMPTY_CELL);
            }
            
            // 更新网格
            this.grid[i] = newRow;
            
            // 检查是否有移动
            if (!moved && !this.arraysEqual(originalRow, newRow)) {
                moved = true;
            }
        }
        
        return { moved, mergedTiles };
    }

    // 向上移动
    moveUp() {
        let moved = false;
        const mergedTiles = [];
        
        for (let j = 0; j < this.GRID_SIZE; j++) {
            // 构建当前列
            const originalCol = [];
            for (let i = 0; i < this.GRID_SIZE; i++) {
                originalCol.push(this.grid[i][j]);
            }
            
            const col = originalCol.filter(cell => cell !== this.EMPTY_CELL);
            
            // 合并相同的方块
            for (let i = 0; i < col.length - 1; i++) {
                if (col[i] === col[i + 1]) {
                    col[i] *= 2;
                    col[i + 1] = this.EMPTY_CELL;
                    this.score += col[i];
                    mergedTiles.push({ row: i, col: j });
                    i++;
                }
            }
            
            // 再次过滤掉空单元格并填充剩余空间
            const newCol = col.filter(cell => cell !== this.EMPTY_CELL);
            while (newCol.length < this.GRID_SIZE) {
                newCol.push(this.EMPTY_CELL);
            }
            
            // 更新网格
            for (let i = 0; i < this.GRID_SIZE; i++) {
                this.grid[i][j] = newCol[i];
            }
            
            // 检查是否有移动
            if (!moved && !this.arraysEqual(originalCol, newCol)) {
                moved = true;
            }
        }
        
        return { moved, mergedTiles };
    }

    // 向下移动
    moveDown() {
        let moved = false;
        const mergedTiles = [];
        
        for (let j = 0; j < this.GRID_SIZE; j++) {
            // 构建当前列
            const originalCol = [];
            for (let i = 0; i < this.GRID_SIZE; i++) {
                originalCol.push(this.grid[i][j]);
            }
            
            const col = originalCol.filter(cell => cell !== this.EMPTY_CELL);
            
            // 合并相同的方块
            for (let i = col.length - 1; i > 0; i--) {
                if (col[i] === col[i - 1]) {
                    col[i] *= 2;
                    col[i - 1] = this.EMPTY_CELL;
                    this.score += col[i];
                    
                    // 计算在网格中的实际位置
                    const actualI = this.GRID_SIZE - col.filter(cell => cell !== this.EMPTY_CELL).length + i;
                    mergedTiles.push({ row: actualI, col: j });
                    i--;
                }
            }
            
            // 再次过滤掉空单元格并填充剩余空间
            const newCol = col.filter(cell => cell !== this.EMPTY_CELL);
            while (newCol.length < this.GRID_SIZE) {
                newCol.unshift(this.EMPTY_CELL);
            }
            
            // 更新网格
            for (let i = 0; i < this.GRID_SIZE; i++) {
                this.grid[i][j] = newCol[i];
            }
            
            // 检查是否有移动
            if (!moved && !this.arraysEqual(originalCol, newCol)) {
                moved = true;
            }
        }
        
        return { moved, mergedTiles };
    }

    // 检查两个数组是否相等
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    // 检查是否还能移动
    canMove() {
        // 如果还有空位，可以移动
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                if (this.grid[i][j] === this.EMPTY_CELL) {
                    return true;
                }
            }
        }

        // 检查水平方向是否有相邻的相同方块
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE - 1; j++) {
                if (this.grid[i][j] === this.grid[i][j + 1]) {
                    return true;
                }
            }
        }

        // 检查垂直方向是否有相邻的相同方块
        for (let i = 0; i < this.GRID_SIZE - 1; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                if (this.grid[i][j] === this.grid[i + 1][j]) {
                    return true;
                }
            }
        }

        // 如果以上条件都不满足，则无法移动
        return false;
    }

    // 检查是否胜利（达到2048）
    checkWin() {
        if (this.isWon) return false; // 已经胜利过了，不再检查

        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                if (this.grid[i][j] === 2048) {
                    this.isWon = true;
                    return true;
                }
            }
        }
        return false;
    }

    // 强制胜利（右键点击标题时调用）
    forceWin() {
        if (this.isWon) return false; // 已经胜利过了，不再触发

        // 在网格中找到一个空位置或最小值位置放置2048
        let placed = false;

        // 首先尝试找空位置
        for (let i = 0; i < this.GRID_SIZE && !placed; i++) {
            for (let j = 0; j < this.GRID_SIZE && !placed; j++) {
                if (this.grid[i][j] === this.EMPTY_CELL) {
                    this.grid[i][j] = 2048;
                    placed = true;
                }
            }
        }

        // 如果没有空位置，替换最小的非空方块
        if (!placed) {
            let minValue = Infinity;
            let minPos = { row: 0, col: 0 };

            for (let i = 0; i < this.GRID_SIZE; i++) {
                for (let j = 0; j < this.GRID_SIZE; j++) {
                    if (this.grid[i][j] < minValue && this.grid[i][j] !== this.EMPTY_CELL) {
                        minValue = this.grid[i][j];
                        minPos = { row: i, col: j };
                    }
                }
            }

            this.grid[minPos.row][minPos.col] = 2048;
        }

        this.isWon = true;
        return true;
    }

    // 游戏结束
    gameOver() {
        this.isGameOver = true;
        return {
            isGameOver: this.isGameOver,
            finalScore: this.score
        };
    }

    // 更新最高分
    updateBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
            return true;
        }
        return false;
    }

    // 保存最高分
    saveBestScore() {
        localStorage.setItem('bestScore2048', this.bestScore);
    }

    // 加载最高分
    loadBestScore() {
        const savedScore = localStorage.getItem('bestScore2048');
        if (savedScore) {
            this.bestScore = parseInt(savedScore);
        }
    }

    // 保存当前游戏状态（在移动之前调用）
    saveCurrentState() {
        this.previousState = {
            grid: this.grid.map(row => [...row]), // 深拷贝网格
            score: this.score
        };
        this.canUndo = true;
    }

    // 撤销到上一个状态
    undo() {
        if (!this.canUndo || !this.previousState || this.undoCount <= 0) {
            return false;
        }

        // 恢复上一个状态
        this.grid = this.previousState.grid.map(row => [...row]); // 深拷贝网格
        this.score = this.previousState.score;
        this.isGameOver = false;

        // 减少撤销次数
        this.undoCount--;
        
        // 清除撤销状态
        this.previousState = null;
        this.canUndo = false;

        return true;
    }

    // 检查是否可以撤销
    getCanUndo() {
        return this.canUndo && this.undoCount > 0;
    }

    // 获取当前游戏状态
    getGameState() {
        return {
            grid: this.grid,
            score: this.score,
            bestScore: this.bestScore,
            isGameOver: this.isGameOver,
            isWon: this.isWon,
            canUndo: this.canUndo,
            undoCount: this.undoCount
        };
    }
}

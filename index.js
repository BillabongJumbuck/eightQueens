"use strict"

/**
 * flag[i]=0表示第i行没有棋子，flag[i]=n表示第(i,n)格有棋子
 * @type {number[]}
 */
let flag = [-1, -1, -1, -1, -1, -1, -1, -1]

/**
 * 更新棋盘数据
 * @param {number[][]} board
 * @param {number} x
 * @param {number} y
 * @return {void}
 */
function updateBoard(board, x , y){
        // 将棋子所在行和列的数据更新
        for(let i = 0;i<8;i++){
            board[i][y] = 0
            board[x][i] = 0
        }
        // 将棋子所在位置的对角线的数据更新
        for(let i= x, j = y; i>=0 && j>=0 ;i--, j--){
            board[i][j] = 0
        }
        for(let i= x, j = y; i<8 && j<8 ;i++, j++){
            board[i][j] = 0
        }
        for(let i= x, j = y; i<8 && j>=0 ;i++, j--){
            board[i][j] = 0
        }
        for(let i= x, j =  y; i>=0 && j<8 ;i--, j++){
            board[i][j] = 0
        }
        board[x][y] = 1  // 表示(x, y)上有棋子
}
/**
 * 响应点击棋盘格子
 * @param {HTMLElement}button
 * @return {void}
 */
function click_01(button){
    // 最多只允许放置八颗棋子
    if(counter === 8){
        alert("只允许放置八颗棋子")
        return
    }

    let id = button.id;
    if(chessboard[id[0]][id[1]] === -1){
        // 当前格子可以安全放置棋子
        // 更新棋盘数组的数据
        updateBoard(chessboard, parseInt(id[0]), parseInt(id[1]))
        flag[id[0]] = parseInt(id[1]) // 表示第x行上有棋子
        counter++   // 已放置的棋子数目加一
    }else{
        // 当前格子不能安全放置棋子
        alert("当前位置不能放置棋子！")
        return;
    }

    // 将点击后的棋盘放置红色棋子
    button.innerHTML = '<img src="red.png" alt="棋子">'
}

/**
 * 绑定清除按钮
 * @return {void}
 */
function resetBoard(){
    clearBoard()
    // 重置棋盘数据
    chessboard = JSON.parse(JSON.stringify(initialBoard)) // js二维数组的深拷贝
    flag = [-1,-1,-1,-1,-1,-1,-1,-1]
    counter = 0
    answers = []
    answerIndex = 0
    let div = document.getElementById("div_01")
    div.innerHTML = ''
}
function clearBoard(){
    // 清除所有棋盘上的棋子,更新相应的数据
    let buttons = document.querySelectorAll("td button")
    for(let i=0;i<buttons.length;i++){
        buttons[i].innerHTML = ''
    }
}

function display_forth(){
    if(answerIndex === 0)
        answerIndex = answers.length-1
    else
        answerIndex--
    display(answers[answerIndex])
}

function display_next(){
    if(answerIndex === answers.length-1)
        answerIndex = 0
    else
        answerIndex++
    display(answers[answerIndex])
}

/**
 * 显示结果
 * @param {number[][]} board
 * @return {void}
 */
function display(board){
    clearBoard()
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(board[i][j] === 1){
                let button = document.getElementById(i.toString()+j.toString())
                button.innerHTML = '<img src="red.png" alt="棋子">'
            }
        }
    }
}

function showAnswer_01(){
    display(answers[0])
    let div = document.getElementById("div_01")
    div.innerHTML =
        `共找到<span id="total">`+answers.length.toString()+`</span>个解。
    <button onclick="display_forth()" class="btn_02">上一个</button>
    <button onclick="display_next()" class="btn_02">下一个</button><br>`
}

function showAnswer_02(answer){
    let div = document.getElementById("div_01")
    if(answer.length === 0){
        div.innerHTML = "没有找到解"
    }else{
        let answerBoard= JSON.parse(JSON.stringify(initialBoard))
        for(let i=0;i<8;i++){
            answerBoard[i][answer[i]] = 1
        }
        div.innerHTML = "找到解！迭代轮数:"+iterators.toString()
        display(answerBoard)
    }
}
function start_01(){
    if(BFS()){
        showAnswer_01()
    }else{
        resetBoard()
        alert("无解")
    }
}

function start_02(){
    changeP = document.getElementById("input_01").value
    maxIterate = document.getElementById("input_02").value
    population = document.getElementById("input_03").value
    let answer = GeneticAlg();
    showAnswer_02(answer)
}

// let rate1 = 0
// let sum1 = 0
// function start_02(){
//     changeP = document.getElementById("input_01").value
//     maxIterate = document.getElementById("input_02").value
//     population = document.getElementById("input_03").value
//     for(let i=0;i<500;i++){
//         let answer = GeneticAlg();
//         if(answer.length !== 0){
//             rate1++;
//             sum1 = sum1 + iterators
//         }
//     }
//     console.log(rate1)
//     console.log(sum1)
//     rate1 = 0
//     sum1 = 0
// }
"use strict"

/** 初始化
 *   -1表示当前格子没有棋子,且若放置棋子不会被其他皇后吃掉
 *   0表示当前格子没有棋子,但若放置棋子会被其他皇后吃掉
 *   1表示当前格子有棋子
 */
let initialBoard = [
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1]
]  // 表示一个全为空的棋盘
let chessboard =  JSON.parse(JSON.stringify(initialBoard))  // js二维数组的深拷贝,初始化棋盘
let counter = 0 // 用于记录当前已放置的棋子数目

let answers = [] // 储存所有答案的数组
let answerIndex = 0 // 遍历答案数组的索引

/**
 * flag = [-1, -1, -1, -1, -1, -1, -1, -1]
 * flag[i]=0表示第i行没有棋子，flag[i]=n表示第(i,n)格有棋子
 * flag在index.js中被声明
 */

/**
 * @return boolean
 */
function BFS() {
    let bfsFlAG = JSON.parse(JSON.stringify(flag)) // flag的深拷贝，记录当前行是否以放置棋子
    let openList = [] // OPEN表，用JS数组实现队列
    openList.push(chessboard) // 将初始棋盘放入OPEN表
    while(openList.length !== 0 ){
        let len = openList.length // 记录当前层的节点数，以支持BFS算法的逐层遍历。
        let row = bfsFlAG.indexOf(-1) // 得到标号最小的未放置棋子的行
        bfsFlAG[row] = 1 // 将该行标记为已放置棋子
        counter++        // 放置的棋子数量加一
        while(len>0){
            let back = openList.shift() // 取出队首元素
            for(let i=0;i<8;i++){
                let tmp = JSON.parse(JSON.stringify(back))
                if(tmp[row][i] === -1){ // 尝试放置棋子，-1表示可以安全放置棋子
                    updateBoard(tmp, row, i) //放置棋子，更新棋盘数据
                    if(counter === 8)   // 若成功放置8颗棋子，说明找到解
                        answers.push(tmp)
                    else                // 否则，将该棋盘放回OPEN表队尾
                        openList.push(tmp)
                }
            }
            // 若该棋盘在这一行无法放置任何一个颗棋子，说明该棋盘的条件下无解，丢弃该棋盘
            len--
        }
    }
    // 若答案数组为空，说明无解，反之有解
    return answers.length !== 0;
}

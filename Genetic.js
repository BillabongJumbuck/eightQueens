"use strict"

/**
 * flag = [-1, -1, -1, -1, -1, -1, -1, -1]
 * flag[i]=0表示第i行没有棋子，flag[i]=n表示第(i,n)格有棋子
 * flag在index.js中声明
 */

let iterators = 0 // 用于统计迭代次数
let changeP = 0.1 // 表示变异概率
let maxIterate = 1000 // 表示最大迭代次数
let population = 100 // 种群中的个体数量
/**
 * 简单遗传算法
 * @return {number[]}
 */
function GeneticAlg(){
    let members = []  // 二维数组，表示种群，每一个元素(一维数组)为一个个体

    let unplacedCol = [] // 统计未放置棋子的列，用于生成初始个体
    for(let i=0;i<8;i++){
        if(!find(flag, i)){
            unplacedCol.push(i)
        }
    }

    // 生成初始种群
    for(let i=0;i<population;i++)
        members.push(generateMember(unplacedCol))

    // 迭代
    for(let i=0;i<maxIterate;i++){
        // 计算个体适应度，并按照适应度由高到低排序
        members = members.sort((x, y) => calculateFitness(y) - calculateFitness(x))

        // 计算适应度最高的个体是否为解，若是，返回解并停止算法
        if(calculateFitness(members[0]) === 28){
            iterators = i+1
            return members[0]
        }

        let newMembers = [] // 新个体，共产生population/2个新个体
        for (let j = 0; j < Math.floor(population/2); j++) {
            // 随机选取适应度前50%的双亲
            let parent1 = members[Math.floor(Math.random() * Math.floor(population/2))]
            let parent2 = members[Math.floor(Math.random() * Math.floor(population/2))]
            // 交叉，产生子代
            let child = cross(parent1, parent2)
            // 子代变异
            if (Math.random() < changeP) {
                child = change(child)
            }
            newMembers.push(child)
        }
        // 取适应度前50%的双亲与新产生的子代构成新的种群
        members = members.slice(0, Math.floor(population/2)).concat(newMembers)
    }
    // 未找到解，返回空数组
    return []
}
/**
 * 根据棋盘的初始状态生成个体
 * @param {number[]} unplacedCol 未放置棋子的列的数组
 * @return {number[]}
 */
function generateMember(unplacedCol){
    let len = unplacedCol.length
    // 将unplaced的元素随机排列
    // 每次随机选取两个元素交换位置
    for(let i = 0;i<len;i++){
        let j = Math.floor(Math.random() * len)
        let x = unplacedCol[i]
        unplacedCol[i] = unplacedCol[j]
        unplacedCol[j] = x
    }

    // 将未放置棋子的列替换为unplaced的内容，得到随机生成的个体
    let ret = JSON.parse(JSON.stringify(flag))
    for(let i=0;i<len;i++){
        ret[ret.indexOf(-1)] = unplacedCol[i]
    }
    return ret
}

/**
 * 计算个体的适应度，适应度为没有与其他任何棋子发生冲突的棋子的数目，
 * 适应度为8表示该个体为一个解
 * @param {number[]} member 表示个体的一维数组
 * @return {number}
 */
function calculateFitness(member){
    let conflict = 0  // 冲突数量
    for(let i=0;i<8;i++){
        for(let j= i+1;j<8;j++){
            if(Math.abs(i - j) === Math.abs(member[i] - member[j])){
                conflict++  // 产生冲突conflict加一
            }
        }
    }
    //conflict最大值为28， 适应度为28减去conflict
    return 28-conflict;
}

/**
 * 交叉操作，双亲染色体单点交叉产生子染色体
 * @param {number[]}parent1 双亲一
 * @param {number[]}parent2 双亲二
 * @return {number[]}
 */
function cross(parent1, parent2){
    // 记录双亲编码的对应关系，若子代编码中含有两个相同编码，根据对应关系进行转换进行去重
    let tmp = Array(8);
    for(let i=0;i<8;i++){
        tmp[parent2[i]] = parent1[i]
    }

    // 单点交叉，随机生成交叉点位
    let position = Math.floor(Math.random()*8)
    let child = parent1.slice(0, position).concat(parent2.slice(position))

    // 若子代编码中含有两个相同编码，根据对应关系进行转换进行去重，保证子代每个编码数字唯一
    for(let i=0;i<position;i++){
        if(find(child.slice(position), child[i])){
            child[i] = tmp[child[i]]
            i--
        }
    }
    return child
}


/**
 * 变异操作
 * @param {number[]}child
 * @return {number[]}
 */
function change(child) {
    // 根据初始棋子摆放情况得到未摆放棋子的行
    let unplacedRow = []
    for(let i=0;i<8;i++){
        if(flag[i] === -1){
            unplacedRow.push(i)
        }
    }
    // 随机得到两个未摆放棋子的行，交换两行的棋子的位置
    let i = unplacedRow[Math.floor(Math.random()*unplacedRow.length)]
    let j = unplacedRow[Math.floor(Math.random()*unplacedRow.length)]
    let tmp = child[i]
    child[i] = child[j]
    child[j] = tmp
    return child
}

/**
 * 用于查找数组中是否含有某个值
 * @param {number[]}nums 一维数组
 * @param {number}x 待查找的值
 * @return {boolean}
 */
function find(nums, x){
    for(let i=0;i<nums.length;i++){
        if(nums[i] === x)
            return true
    }
    return false
}

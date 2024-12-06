import { dir } from "console";

const diff = {
  'right': {
    x: 20,
    y: 0
  },
  'left': {
    x: -20,
    y: 0
  },
  'top': {
    x: 0,
    y: -20
  },
  'bottom': {
    x: 0,
    y: 20
  }
}
const oppsite = {
  'right': 'left',
  'left': 'right',
  'bottom': 'top',
  'top': 'bottom',
}

/**
 * 
 * @param origin 
 * @param target 
 * @param sdir      起点延伸方向
 * @param edir      终点延伸方向
 * @return {*}  M100,100 L200,100 L200,200
 */
const drawLine = (origin, target, sdir, edir, move = false) => {

  // 起始dir为空的情况

  
  // 起点内联点
  const start = {
    x: origin.x + diff[sdir].x,
    y: origin.y + diff[sdir].y
  }

  // 从node出来没有连接其他node的情况，目标dir为空
  if(sdir && !edir) {
    if(sdir == 'left' || sdir == 'right') {
      edir = target.x > start.x ? 'left' : 'right'
    }else {
      // edir = target.y < start.y ? 'bottom' : 'top'
      edir = target.y < origin.y ? 'bottom' : 'top'
    }
  }

  // if(edir == 'bottom' && !move) target.y = target.y - 10
  
  // 终点内联点
  const end = {
    x: target.x + diff[edir].x,
    y: target.y + diff[edir].y
  }

  // 求x轴延伸到终点
  const p1 = {
    x: end.x,
    y: start.y
  }

  const points1 = [
    origin,
    start,
    p1,
    end,
    target,
  ]

  // 求y轴延伸到终点
  const p3 = {
    x: start.x,
    y: end.y
  }

  const points2 = [
    origin,
    start,
    p3,
    end,
    target,
  ]

  let isCross1 = isCrossPoint(start,p1,origin,end,p1,target)
  let isCross2 = isCrossPoint(start,p3,origin,end,p3,target)
  
  // 都合格
  if(isCross1 && isCross2) {
    console.log('不合格'); 
    // 都不合格，取没经过起点的进行中点延伸
    const crossStart1 = isCrossPoint(points1[2],points1[1],points1[0])
    const crossStart2 = isCrossPoint(points2[2],points2[1],points2[0])

    const p = !crossStart1 ? generateExtPoint(points1, 1) : generateExtPoint(points2, 2)
    return computed(p)
  }
  const angle1 = countRightAngles(points1)
  const angle2 = countRightAngles(points2)
  // 取弯折少的
  const extX = generateExtPoint(points1, 1)
  const extY = generateExtPoint(points2, 2)

  if(!isCross1 && !isCross2) {   
    console.log('都合格'); 
    const extXAngle = countRightAngles(extX)
    const extYAngle = countRightAngles(extY)
    // 判断是否终点和起点在中间的情况
    // const crossX = isCrossPoint(extX[2],extX[1],extX[0],extX[3],extX[4],extX[extX.length - 1])
    // const crossY = isCrossPoint(extY[2],extY[1],extY[0],extY[3],extY[4],extY[extY.length - 1])
    
    if(sdir == 'right' || sdir == 'left') {
      if(arePointsCollinear(extX[0],extX[1],extX[2]) && isCrossPoint(extX[0],extX[1],extX[2])) {
        if(target.x < origin.x) {
          return computed(points2)
        }
        return computed(extY)
      }
      if(edir == oppsite[sdir]) {
        
        return computed(extX)
      }

      if(arePointsCollinear(points1[3],points1[4],points1[2]) && isCrossPoint(points1[3],points1[4],points1[2])){
        return computed(extX)
      }
      return computed(points1)
    }

    if(sdir == 'bottom' || sdir == 'top') {
      if(arePointsCollinear(extY[0],extY[1],extY[2]) && isCrossPoint(extY[0],extY[1],extY[2])) {
        if(target.y > origin.y && sdir == edir) {
          return computed(points1)
        }
        if(target.y < origin.y) {
          return computed(points1)
        }
        return computed(extX)
      }
      if(edir == oppsite[sdir]) {
        return computed(extY)
      }

      if(arePointsCollinear(points2[3],points2[4],points2[2]) && isCrossPoint(points2[3],points2[4],points2[2])){
        return computed(extY)
      }
      return computed(points2)

    }

    
    // if(sdir == 'right') {
    //   if(end.x < start.x && sdir == 'right') {
    //     if(start.x <= target.x) return computed(extY)
    //     if(start.x > target.x) return computed(points2)
    //   }
    //   if(start.x <= end.x) {
    //     if(sdir == 'right' && edir == 'right') {
    //       return computed(points1)
    //     }
    //     if(sdir == 'right' && edir == 'left') {
    //       return computed(extX)
    //     }
    //   }
    //   return computed(points1)
    // }
    // else if(sdir == 'left') {
    //   if(end.x > start.x && start.x >= target.x && sdir == 'left') {
    //     return computed(extY)
    //   }
    //   if(start.x >= end.x) {
    //     if(sdir == 'left' && edir == 'right') {
    //       return computed(extX)
    //     }
    //     return computed(points1)
    //   } 
    //   return computed(points2)
    // }
    // else{
      // if(sdir == 'top') {
      //   if(end.y <= start.y) {
      //     if(edir == 'top') {
      //       return computed(points2)
      //     }
      //     if(edir == 'bottom') {
      //       return computed(extY)
      //     }
      //   }else{
      //     return computed(points1)
      //   } 
      // }

      // if(sdir == 'bottom') {
      //   if(end.y >= start.y && edir == 'bottom') {
      //     return computed(points2)
      //   } 
      //   if(end.y >= start.y && edir == 'top') {
      //     return computed(extY)
      //   }
      //   if(end.y < start.y && edir == 'bottom') {
      //     return computed(points1)
      //   }
      //   if(end.y < start.y && edir == 'top') {
      //     return computed(extX)
      //   }
      // }  
    //   if(extYAngle > angle2) {
    //     return computed(points2)
    //   }
    //   return computed(extY)
    //   console.log('88888888888888888888');
    // }
  }else {
    console.log('一个合格'); 
    // 取一个：过起始终点的为true
    // 1为真穿过两点取points2
    const p = isCross1 ? points2 : points1
    const tempAngle = isCross1 ? angle2 : angle1

    // 经过
    let extX = generateExtPoint(points1,1)
    let extY = generateExtPoint(points2,2)
    const crossX = isCrossPoint(extX[2],extX[1],extX[0],extX[3],extX[4],extX[extX.length - 1])
    const crossY = isCrossPoint(extY[2],extY[1],extY[0],extY[3],extY[4],extY[extY.length - 1])
    if(crossX && crossY) return computed(p)
    if(!crossX && !crossY) {
      if(isCrossPoint(extY[0],extY[1],extY[2])) {
        if(countRightAngles(extX) > tempAngle) return computed(p)
        return computed(extX)
      }else {
        if(countRightAngles(extY) > tempAngle) return computed(p)
        if(arePointsCollinear(extY[5],extY[4],extY[3]) && isCrossPoint(extY[5],extY[4],extY[3])) {
          return computed(p)
        }
        return computed(extY)
      }
    }
    if(crossX) {
      // 需要检查拐点是否在内联点和终点之间
      if(arePointsCollinear(extY[5],extY[4],extY[3]) && isCrossPoint(extY[5],extY[4],extY[3])) {
        return computed(p)
      }
      if(countRightAngles(extY) > tempAngle) return computed(p)
      if(arePointsCollinear(extY[0],extY[1],extY[2]) && isCrossPoint(extY[0],extY[1],extY[2])) {
        return computed(p)
      }
      return computed(extY)
    }
    if(crossY){
      // 需要检查拐点是否在内联点和终点之间
      if(arePointsCollinear(extX[5],extX[4],extX[3]) && isCrossPoint(extX[5],extX[4],extX[3])) {
        return computed(p)
      }
      if(countRightAngles(extX) > tempAngle) return computed(p)
      if(arePointsCollinear(extX[0],extX[1],extX[2]) && isCrossPoint(extX[0],extX[1],extX[2])) {
        return computed(p)
      }
      return computed(extX)
    }
    // return computed(p)
  }
}

function computed(arry) {
  const result = arry.map((p, i) => {
    if(i == 0) {
      return `M${p.x},${p.y}`
    }
    return `L${p.x},${p.y}`
  })
  return {
    d: result.join(' '),
    end: arry[arry.length - 1],
    begin: arry[0],
  }
}

// 三点共线
function arePointsCollinear(A, B, C) {
  const { x: x1, y: y1 } = A;
  const { x: x2, y: y2 } = B;
  const { x: px, y: py } = C;

  // 使用向量法计算叉积
  const crossProduct = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);

  return crossProduct === 0;
}

// 创建中点延伸折线 type 1 x轴方向的中点延伸 2 y轴方向的中点延伸
function generateExtPoint(points, type = 1) {
  const s = points[1]
  const p = points[2]
  const e = points[3]
  if(type == 1) {
    // console.log('x轴平行线');
    const k1 = {
      x: (p.x - s.x) / 2 + s.x ,
      y: p.y
    }
    const k2 = {
      x: k1.x,
      y: e.y
    }
    return [
      points[0],s,k1,k2,e,
      points[points.length - 1]
    ]
  }else{
    // console.log('y轴平行线');
    // y轴
    const k1 = {
      x: p.x,
      y: (p.y - s.y) / 2 + s.y
    }
    const k2 = {
      x: e.x,
      y: k1.y
    }
    return [
      points[0],s,k1,k2,e,
      points[points.length - 1]
    ]
  }
}

// 是否平行
function areLinesParallel(A, B, C, D) {
  return (B.x - A.x) * (D.y - C.y) === (B.y - A.y) * (D.x - C.x);
}

function isPointBetween(A, B, P) {
  if(!(A && B && P)) return
  // 检查三点是否共线
  const isCollinear = (P.x - A.x) * (B.y - A.y) === (P.y - A.y) * (B.x - A.x);
  // 检查 P 是否在 A 和 B 的中间
  const isBetweenX = Math.min(A.x, B.x) <= P.x && P.x <= Math.max(A.x, B.x);
  const isBetweenY = Math.min(A.y, B.y) <= P.y && P.y <= Math.max(A.y, B.y);
  return isCollinear && isBetweenX && isBetweenY;
}

// 是否经过起点或者终点
function isCrossPoint(p1,p2,p3,p4,p5,p6) {
  return isPointBetween(p1,p2,p3) || isPointBetween(p4,p5,p6)
}

function countRightAngles(points) {
  let rightAngleCount = 0;

  for (let i = 1; i < points.length - 1; i++) {
    // 直接计算前后两条线段的点积
    if 
    (
      (points[i].x - points[i - 1].x) * (points[i + 1].x - points[i].x) 
      + (points[i].y - points[i - 1].y) * (points[i + 1].y - points[i].y) 
      === 0
    ) rightAngleCount++;  
  }
  return rightAngleCount;
}

export default drawLine
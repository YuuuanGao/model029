let model;
let video;
let isModelReady = false;
let nmsResults = [];
let labels = ["blue1", "yellow4", "red4", "purple1", "green8", "blue4", "green6", "orange4"];
let img0,img1, img2; // 声明图像变量
let myFont; // 声明字体变量
let   fs=60
// 设置画布大小为720x960
const canvasSize = { width: 720, height: 960 }; // 画布宽高
const modelInputSize = 640; // YOLO 模型输入尺寸（正方形）

// 预加载模型和图像
function preload() {
  myFont = loadFont('1.otf'); // 加载 1.otf 字体


  // 加载图像
  img0 = loadImage('0.png'); // 加载 1.png
  img1 = loadImage('1.png'); // 加载 1.png
  img2 = loadImage('2.png'); // 加载 2.png
}

function setup() {
  createCanvas(canvasSize.width, canvasSize.height); // 创建画布
 
}
let   p1=undefined
let    p2=undefined

// 处理上传的文件
function handleFile(v) {


  console.log("kmkmkmk")

  if(v==1){

    let file=sessionStorage.getItem("imageSrc1");

    p1 = loadImage(file, () => {
      
    });

  }
  if(v==2){

    let file=sessionStorage.getItem("imageSrc2");

    p2= loadImage(file, () => {
      
    });

  }


  

}

let frameCount = 0; // Initialize frame count

function draw() {
  background(255); // 设置背景为白色

  image (img0,0,0,width,height)
  window.addEventListener('message', function(event) {
    // 更新显示的变量
    nmsResults = event.data;
});

translate(0,-65)
scale(0.85)
  let squarePoints = {
    orange4: null,
    blue4: null,
    red4: null,
    yellow4: null,
    green8: null,
    green6: null,
    purple1: null,
    blue1: null
  };

  // 绘制每个识别物体的中心点和坐标
  for (let i = 0; i < nmsResults.length; i++) {
    const detection = nmsResults[i];
    const label = detection.label;

    const box = detection.box;
    const y1 = box[0] * (height / modelInputSize);
    const x1 = box[1] * (width / modelInputSize);
    const y2 = box[2] * (height / modelInputSize);
    const x2 = box[3] * (width / modelInputSize);

    const centerX = x1 + (x2 - x1) / 2;
    const centerY = y1 + (y2 - y1) / 2;

    if (label in squarePoints) {
      squarePoints[label] = { x: centerX, y: centerY };
    }

    // 绘制圆形关键点
    // 绘制不同形状的关键点
    noFill();
    if (label === "green8") {
      noStroke(); 
      fill(0, 105, 52); // 绿色
      beginShape();
      for (let j = 0; j < 8; j++) {
        const angle = TWO_PI / 8 * j;
        const x = centerX + 10 * cos(angle);
        const y = centerY + 10 * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
    } else if (label === "green6") {
      noStroke(0);
      fill(92, 181, 49); // 绿色
      beginShape();
      for (let j = 0; j < 6; j++) {
        const angle = TWO_PI / 6 * j;
        const x = centerX + 10 * cos(angle);
        const y = centerY + 10 * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
    } else if (label === "red4") {
      noStroke(); 
      fill(208, 18, 27); // 红色
      rect(centerX - 10, centerY - 10, 20, 20); // 红色四边形
    } else if (label === "blue4") {
      noStroke(); 
      fill(0, 160, 233); // 蓝色
      rect(centerX - 10, centerY - 10, 20, 20); // 蓝色正方形
    } else if (label === "orange4") {
      noStroke(); 
      fill(235, 97, 0); // 橙色
      rect(centerX - 15, centerY - 10, 30, 20); // 橙色矩形
    } else if (label === "yellow4") {
      noStroke(); 
      fill(248, 181, 0); // 黄色
      rect(centerX - 15, centerY - 10, 30, 20); // 黄色矩形
    } else if (label === "purple1") {
      fill(128, 0, 128); // 紫色
      ellipse(centerX, centerY, 20); // 紫色圆
    } else if (label === "blue1") {
      fill(29, 32, 136); // 蓝色
      ellipse(centerX, centerY, 20); // 蓝色圆
    }

    // 显示中心点坐标
    noStroke();
    // 根据关键点的颜色设置坐标文本颜色
    if (label === "green8" || label === "green6") {
      fill(0, 255, 0); // 绿色
    } else if (label === "red4") {
      fill(255, 0, 0); // 红色
    } else if (label === "blue4" || label === "blue1") {
      fill(0, 0, 255); // 蓝色
    } else if (label === "orange4") {
      fill(255, 165, 0); // 橙色
    } else if (label === "yellow4") {
      fill(255, 255, 0); // 黄色
    } else if (label === "purple1") {
      fill(128, 0, 128); // 紫色
    }

    // 显示中心点坐标
    noStroke(); // 确保没有描边
    // fill(0); // 设置文本颜色为黑色
    textFont(myFont); // 设置字体为 1.otf
    textSize(14); // 设置文本大小
    // text(`(${centerX.toFixed(0)}, ${centerY.toFixed(0)})`, centerX, centerY + 20); // 将 x 坐标设置为关键点的 x 坐标

    // 显示置信度
    textSize(10); // 设置较小的文本大小
    // text(`Confidence: ${detection.confidence.toFixed(2)}`, centerX, centerY + 35); // 将置信度文本位置调整为关键点的 x 坐标
  }
 if (squarePoints.blue1) {
    drawRectangleWithDiagonals(squarePoints.blue1.x, squarePoints.blue1.y + 20, 150, 200,0);
  }

  if (squarePoints.purple1) {
    drawRectangleWithDiagonals(squarePoints.purple1.x, squarePoints.purple1.y + 20, 300, 150,1);
  }
  
  // 连接关键点之间的线
  if (squarePoints.orange4 && squarePoints.blue4 && squarePoints.red4 && squarePoints.yellow4) {
    push(); // 保存当前绘图状态
    stroke(0); // 设置正方形颜色为蓝色
    strokeWeight(1);
    noFill();
  drawingContext.setLineDash([5, 10]); // 设置虚线样式，参数表示线段长度和间隙长度


    // 连接四个点绘制正方形


    fill(255)
    beginShape();
    vertex(squarePoints.orange4.x, squarePoints.orange4.y);
    vertex(squarePoints.blue4.x, squarePoints.blue4.y);
    vertex(squarePoints.red4.x, squarePoints.red4.y);
    vertex(squarePoints.yellow4.x, squarePoints.yellow4.y);
    endShape(CLOSE); // 闭合正方形
    pop(); // 恢复之前的绘图状态
     let vertices = [
      { x: squarePoints.orange4.x, y: squarePoints.orange4.y },
      { x: squarePoints.blue4.x, y: squarePoints.blue4.y },
      { x: squarePoints.red4.x, y: squarePoints.red4.y },
      { x: squarePoints.yellow4.x, y:squarePoints.yellow4.y }
    ];


    drawClippedLines(vertices)
    // 计算矩形的坐标
    const leftX = Math.max(squarePoints.blue4.x, squarePoints.orange4.x);
    const rightX = Math.min(squarePoints.red4.x, squarePoints.yellow4.x);
    const topY = Math.max(squarePoints.orange4.y, squarePoints.blue4.y); // 确保顶部在不规则四边形内部
    const bottomY = Math.min(squarePoints.red4.y, squarePoints.yellow4.y); // 确保底部在不规则四边形内部

    // 绘制矩形
    if (leftX < rightX) { // 确保矩形有效
      noFill(0); // 设置矩形填充颜色为蓝色，带透明度
      // stroke(255); // 确保矩形没有边框
      // strokeWeight(10);
      rectMode(CORNER); // 设置矩形模式为左上角

      // fill(255)
      // rect(leftX, topY, rightX - leftX,  bottomY-topY ); // 绘制矩形
      // console.log(rightX - leftX)
      let pm=window.parent.document.getElementById("m2").value

      push()


      // 下面的子大小是固定的  40
      textSize(20)

      textAlign(LEFT)
    
      // strokeWeight(1)

      // stroke(0)

      fill(0)


      // console.log(topY-bottomY + topY)

      drawWrappedText(pm,leftX, bottomY,rightX - leftX);
      // text(pm,leftX, bottomY,rightX - leftX)


      pop()
     
    }
  }

  // 绘制 green6 和 green8 之间的连线及矩形
if (squarePoints.green6 && squarePoints.green8) {
  // 计算连线的中点
  const midX = (squarePoints.green6.x + squarePoints.green8.x) / 2;
  const midY = (squarePoints.green6.y + squarePoints.green8.y) / 2;

  // 计算连线的长度和角度
  const lineLength = dist(
    squarePoints.green6.x, squarePoints.green6.y,
    squarePoints.green8.x, squarePoints.green8.y
  );
  const rectHeight = lineLength * 0.2; // 矩形高度为连线长度的 20%
  const angle = atan2(
    squarePoints.green8.y - squarePoints.green6.y,
    squarePoints.green8.x - squarePoints.green6.x
  );

  // 绘制矩形
  push();
  noFill(); // 确保没有填充
  stroke(210); // 灰色描边
  // strokeWeight(10); // 描边宽度
  translate(midX, midY); // 平移到中点
  rotate(angle); // 旋转矩形角度
  rectMode(CENTER); // 设置矩形模式为中心

  fill(255)
  rect(0, rectHeight / 2, lineLength-5, rectHeight-5); // 绘制矩形


  // 计算矩形的四个角坐标
  let halfWidth = (lineLength - 5) / 2;
  let halfHeight = (rectHeight - 5) / 2;

  let topLeft = { x: -halfWidth, y: halfHeight };
  let topRight = { x: halfWidth, y: halfHeight };
  let bottomLeft = { x: -halfWidth, y: -halfHeight };
  let bottomRight = { x: halfWidth, y: -halfHeight };

  // 创建 vertices 数组
  let vertices1 = [
    { x: topLeft.x, y: topLeft.y },
    { x: bottomLeft.x, y: bottomLeft.y },
    { x: bottomRight.x, y: bottomRight.y },
    { x: topRight.x, y: topRight.y }
   
    
    
  ];
  let leftX = - (lineLength - 5) / 2; // 计算左上角的 x 坐标
  let topY = (rectHeight / 2) - (rectHeight - 5) / 2; // 计算左上角的 y 坐标
  fill(255)
  // 绘制矩形
  // rect(leftX, topY, lineLength - 5, rectHeight - 5);
stroke(3, 125, 255)
  drawDiagonalLines(leftX, topY, lineLength - 5, rectHeight - 5,40)//text1间隙
  push()
  let pm=window.parent.document.getElementById("m1").value

  
  

  fs = rectHeight-5; // 使字号等于长方形的高度
  textSize(fs); // 更新字号

  // 计算文本宽度
  let textW = textWidth(pm);
  
  // 如果文本宽度超出长方形宽度，则逐渐减小字号
  while (textW > lineLength-5) {
      fs -= 1; // 减小字号
      textSize(fs); // 更新字号
      textW = textWidth(pm); // 重新计算文本宽度
  }
  // textSize((lineLength-5)/pm.length)
  textAlign(CENTER,CENTER)
  fill(0)
  noStroke()

  imageMode (CENTER)
  
  // image(img2,0, rectHeight / 2,lineLength-5, rectHeight-5)
  text(pm,0, rectHeight / 2)


  pop()
  pop();

  // 绘制连线
  push();
  stroke(0); // 设置颜色为黑色
  strokeWeight(1); // 设置线条宽度
  drawingContext.setLineDash([5, 10]); // 设置虚线样式
  line(squarePoints.green6.x, squarePoints.green6.y, squarePoints.green8.x, squarePoints.green8.y);
  pop();
}



  // 显示检测到的物体数量
  fill(0); // 设置文本颜色为黑色
  textSize(16); // 设置文本大小
  noStroke(); // 确保没有描边
  text(`Detected Objects: ${nmsResults.length}`, 10, 20+75); // 显示检测到的物体数量

  // 显示当前帧数
  frameCount++; // 每次绘制调用时增加帧计数
  text(`Frame Count: ${frameCount}`, 10, 40+75); // 显示当前帧数
}


function drawDiagonalLines(startX, startY, rectWidth, rectHeight, lineSpacing) {

  push()

  strokeWeight(1) //text1粗细
  // 绘制45度斜线
  for (let x = startX; x < startX + rectWidth; x += lineSpacing) {
    for (let y = startY; y < startY + rectHeight; y += lineSpacing) {
      // 计算斜线的终点坐标
      let endX = x + rectHeight;
      let endY = y + rectWidth;

      // 检查斜线是否超出矩形边界，并调整终点坐标
      if (endX > startX + rectWidth) {
        endX = startX + rectWidth;
        endY = y + (endX - x);
      }
      if (endY > startY + rectHeight) {
        endY = startY + rectHeight;
        endX = x + (endY - y);
      }

      // 绘制斜线
      line(x, y, endX, endY);
    }
  }

  pop()
}

function drawWrappedText(text1, x, y, maxWidth) {

  push()

  noStroke()
  let currentLine = ''; // 当前行文本

  for (let i = 0; i < text1.length; i++) {
    let char = text1.charAt(i);
    let testLine = currentLine + char;
    let testWidth = textWidth(testLine);

    if (testWidth > maxWidth && currentLine.length > 0) {
      text(currentLine, x, y);
      currentLine = char; // 开始新的一行
      y += 25; // 行间距
    } else {
      currentLine = testLine; // 继续添加字符
    }
  }
  
  // 绘制最后一行
  if (currentLine.length > 0) {
    text(currentLine, x, y);
  }

  pop()
}
function drawClippedLines(vertices) {

  push()

  noFill()
  // 设置剪裁区域为四边形
  beginShape();
  for (let v of vertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
  
  // 获取 Canvas 的绘图上下文
  let ctx = drawingContext;

  // 创建剪裁路径
  ctx.save(); // 保存当前绘图状态
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  ctx.closePath();
  ctx.clip(); // 应用剪裁

  // 设置斜线的样式
  stroke(255, 146, 3);
  strokeWeight(1);//text2粗细
  
  // 绘制斜线
  let spacing = 20; // text2间距
  for (let y = -width; y < height; y += spacing) {
    line(0, y, width, y + width);
  }

  ctx.restore(); // 恢复绘图状态

  pop()
}
function saveImage(){


  let croppedImage = get(0, 0, 691 * 0.85, 918 * 0.85);
  
  // 将裁剪后的图像放大
  let scaledImage = createImage(croppedImage.width * 2, croppedImage.height * 2);
  scaledImage.copy(croppedImage, 0, 0, croppedImage.width, croppedImage.height, 0, 0, scaledImage.width, scaledImage.height);
  
  // 保存图像
  scaledImage.save('03', 'png');
  // let croppedImage = get(0, 0, 691*0.85, 918*0.85);

  // // 保存裁剪后的图像
  // croppedImage.save('03', 'png');

  // saveCanvas('03.jpg');

}
function drawRectangleWithDiagonals(x, y, width, height,z) {
  // 绘制矩形框
  push(); // 保存当前绘图状态
  noFill(); // 确保没有填充
  stroke(0); // 黑色描边
  strokeWeight(1); // 描边宽度
  drawingContext.setLineDash([5, 10]); // 设置虚线样式
  rectMode(CORNER); // 设置矩形模式为左上角
  rect(x, y, width, height); // 绘制矩形框
  pop(); // 恢复绘图状态



  if(z==0&&p1){

    

    push()
  imageMode(CORNER)
    image(p1,x, y, width, height)

    pop()
  }
  if(z==1&&p2){



    push()
    imageMode(CORNER)
    image(p2,x, y, width, height)

    pop()
  }


}



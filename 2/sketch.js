let model;
let video;
let isModelReady = false;
let nmsResults = [];
let labels = ["blue1", "yellow4", "red4", "purple1", "green8", "blue4", "green6", "orange4"];
let img1, img2; // 声明图像变量
let myFont; // 声明字体变量

// 设置画布大小为720x960
const canvasSize = { width: 720, height: 960 }; // 画布宽高
const modelInputSize = 640; // YOLO 模型输入尺寸（正方形）
// 270 339
// 预加载模型和图像
function preload() {
  myFont = loadFont('1.otf'); // 加载 1.otf 字体
  // tf.loadGraphModel('https://yuuuangao.github.io/8graphics/tfjs_model/model.json')
  //   .then((loadedModel) => {
  //     model = loadedModel;
  //     isModelReady = true;
  //     console.log("模型加载成功");
  //   })
  //   .catch((error) => {
  //     console.error("模型加载失败: ", error);
  //   });

  // 加载图像
  img1 = loadImage('1.png'); // 加载 1.png
  img2 = loadImage('2.png'); // 加载 2.png
}

function setup() {
  createCanvas(canvasSize.width, canvasSize.height); // 创建画布
  // video = createCapture(VIDEO);
  // video.size(modelInputSize, modelInputSize); // 保持模型输入尺寸
  // video.hide();
  // setInterval(detectObjects, 100);
}

let frameCount = 0; // Initialize frame count

function draw() {
  background(255); // 设置背景为白色
  translate(0,-15)
  scale (0.35)
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
  window.addEventListener('message', function(event) {
    // 更新显示的变量
    nmsResults = event.data;
  });
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
    noFill();
    stroke(210); // 设置描边颜色为灰色
    strokeWeight(8); // 设置描边宽度
    ellipse(centerX, centerY, 18); // 绘制圆形

    // 显示中心点坐标
    noStroke(); // 确保没有描边
    fill(0); // 设置文本颜色为黑色
    textFont(myFont); // 设置字体为 1.otf
    textSize(14); // 设置文本大小
    text(`(${centerX.toFixed(0)}, ${centerY.toFixed(0)})`, centerX, centerY + 20); // 将 x 坐标设置为关键点的 x 坐标

    // 显示置信度
    textSize(10); // 设置较小的文本大小
    text(`Confidence: ${detection.confidence.toFixed(2)}`, centerX, centerY + 35); // 将置信度文本位置调整为关键点的 x 坐标
  }
 if (squarePoints.blue1) {
    drawRectangleWithDiagonals(squarePoints.blue1.x, squarePoints.blue1.y + 20, 150, 200);
  }

  if (squarePoints.purple1) {
    drawRectangleWithDiagonals(squarePoints.purple1.x, squarePoints.purple1.y + 20, 300, 150);
  }
  
  // 连接关键点之间的线
  if (squarePoints.orange4 && squarePoints.blue4 && squarePoints.red4 && squarePoints.yellow4) {
    push(); // 保存当前绘图状态
    stroke(0); // 设置正方形颜色为蓝色
    strokeWeight(1);
    noFill();
  drawingContext.setLineDash([5, 10]); // 设置虚线样式，参数表示线段长度和间隙长度


    // 连接四个点绘制正方形
    beginShape();
    vertex(squarePoints.orange4.x, squarePoints.orange4.y);
    vertex(squarePoints.blue4.x, squarePoints.blue4.y);
    vertex(squarePoints.red4.x, squarePoints.red4.y);
    vertex(squarePoints.yellow4.x, squarePoints.yellow4.y);
    endShape(CLOSE); // 闭合正方形
    pop(); // 恢复之前的绘图状态

    // 计算矩形的坐标
    const leftX = Math.max(squarePoints.blue4.x, squarePoints.orange4.x);
    const rightX = Math.min(squarePoints.red4.x, squarePoints.yellow4.x);
    const topY = Math.min(squarePoints.orange4.y, squarePoints.blue4.y); // 确保顶部在不规则四边形内部
    const bottomY = Math.max(squarePoints.red4.y, squarePoints.yellow4.y); // 确保底部在不规则四边形内部

    // 绘制矩形
    if (leftX < rightX) { // 确保矩形有效
      noFill(0); // 设置矩形填充颜色为蓝色，带透明度
      stroke(210); // 确保矩形没有边框
      strokeWeight(10);
      rectMode(CORNER); // 设置矩形模式为左上角
      rect(leftX, topY, rightX - leftX, bottomY - topY); // 绘制矩形
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
  strokeWeight(10); // 描边宽度
  translate(midX, midY); // 平移到中点
  rotate(angle); // 旋转矩形角度
  rectMode(CENTER); // 设置矩形模式为中心
  rect(0, rectHeight / 2, lineLength-5, rectHeight-5); // 绘制矩形
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
  text(`Detected Objects: ${nmsResults.length}`, 10, 20); // 显示检测到的物体数量

  // 显示当前帧数
  frameCount++; // 每次绘制调用时增加帧计数
  text(`Frame Count: ${frameCount}`, 10, 40); // 显示当前帧数
}

// 对象检测函数
function detectObjects() {
  if (!video || !isModelReady) return;

  if (video.loadedmetadata) {
    const videoFrame = tf.browser.fromPixels(video.elt);
    const resizedFrame = tf.image.resizeBilinear(videoFrame, [modelInputSize, modelInputSize]).div(255.0);
    const transposedFrame = resizedFrame.transpose([2, 0, 1]);
    const batchedFrame = transposedFrame.expandDims(0);

    const predictions = model.execute(batchedFrame);
    processDetections(predictions);

    videoFrame.dispose();
    resizedFrame.dispose();
    transposedFrame.dispose();
    batchedFrame.dispose();
  }
}

// 处理检测结果
function processDetections(predictions) {
  const boxesTensor = predictions;
  const boxes = boxesTensor.clone().arraySync();
  const detections = [];

  for (let i = 0; i < boxes[0].length; i++) {
    const box = boxes[0][i];
    const center_x = box[0];
    const center_y = box[1];
    const width = box[2];
    const height = box[3];

    const classScores = box.slice(5);
    const maxClassScoreInfo = classScores.reduce((acc, score, index) => {
      if (score > acc.maxScore) {
        acc.maxScore = score;
        acc.classID = index;
      }
      return acc;
    }, { maxScore: -Infinity, classID: -1 });

    const maxClassScore = maxClassScoreInfo.maxScore;
    const classID = maxClassScoreInfo.classID;

    const x1 = center_x - (width / 2);
    const y1 = center_y - (height / 2);
    const x2 = center_x + (width / 2);
    const y2 = center_y + (height / 2);

    detections.push({
      box: [y1, x1, y2, x2],
      confidence: maxClassScore,
      classID: classID,
      label: labels[classID]
    });
  }

  const boxesTensor2D = tf.tensor2d(detections.map(d => d.box), [detections.length, 4]);
  const scores = tf.tensor1d(detections.map(d => d.confidence));

  tf.image.nonMaxSuppressionAsync(boxesTensor2D, scores, 8, 0.000001, 0.94).then((output) => {
    nmsResults = output.arraySync().map(index => detections[index]);
    boxesTensor2D.dispose();
    scores.dispose();
  });
}

function drawRectangleWithDiagonals(x, y, width, height) {
  // 绘制矩形框
  push(); // 保存当前绘图状态
  noFill(); // 确保没有填充
  stroke(0); // 黑色描边
  strokeWeight(1); // 描边宽度
  drawingContext.setLineDash([5, 10]); // 设置虚线样式
  rectMode(CORNER); // 设置矩形模式为左上角
  rect(x, y, width, height); // 绘制矩形框
  pop(); // 恢复绘图状态

  // 绘制对角线
  push(); // 再次保存当前绘图状态
  drawingContext.setLineDash([]); // 清除虚线样式，确保对角线为实线
  stroke(210); // 灰色描边
  strokeWeight(10); // 较粗的描边宽度
  strokeCap(PROJECT); // 设置线条末端为方角
  // 调整对角线的计算，基于左上角 (x, y)
  line(x + 5, y + 5, x + width - 5, y + height - 5); // 对角线 1
  line(x + width - 5, y + 5, x + 5, y + height - 5); // 对角线 2
  pop(); // 恢复绘图状态
}



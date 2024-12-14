let model;
let video;
let isModelReady = false;
let nmsResults = [];
let labels = ["blue1", "yellow4", "red4", "purple1", "green8", "blue4", "green6", "orange4"];
let videoReady = false;

// 预加载模型
function preload() {
  tf.loadGraphModel('https://yuuuangao.github.io/8graphics/tfjs_model/model.json')
    .then((loadedModel) => {
      model = loadedModel;
      isModelReady = true;
      console.log("模型加载成功");
    })
    .catch((error) => {
      console.error("模型加载失败: ", error);
    });
}

function setup() {
  createCanvas(600, 800);

  // 设置视频输入
  video = createCapture(VIDEO);
  video.size(640, 640);
  video.hide(); // 隐藏视频元素，仅在画布上显示
  video.elt.onloadedmetadata = () => {
    videoReady = true;
  };

  // 定时执行对象检测
  setInterval(detectObjects, 100); // 每 100 毫秒运行一次检测
}

function draw() {
  scale (0.45,0.39)
  image(video, 0, 0, width, height); // 显示摄像头视频
  window.parent.postMessage(nmsResults, '*');
  for (let i = 0; i < nmsResults.length; i++) {
    const detection = nmsResults[i];
    stroke(255);
    strokeWeight(4);
    noFill();

    // 提取并调整坐标
    const box = detection.box;
    const y1 = box[0] * 1.25;
    const x1 = box[1] * 0.9375;
    const y2 = box[2] * 1.25;
    const x2 = box[3] * 0.9375;

    // 计算调整后的宽度和高度
    const width = x2 - x1;
    const height = y2 - y1;

    // 绘制矩形框
    rect(x1, y1, width, height);

    noStroke();
    fill(255);
    textSize(20);
    text(detection.label, x1 + 10, y1 + 24);
  }
}

function detectObjects() {
  if (!video || !isModelReady || !videoReady) return;

  // 确保视频帧已准备好
  const videoFrame = tf.browser.fromPixels(video.elt); // 获取视频帧
  const resizedFrame = tf.image.resizeBilinear(videoFrame, [640, 640]).div(255.0);
  const transposedFrame = resizedFrame.transpose([2, 0, 1]); // 转换为 [3, 640, 640]
  const batchedFrame = transposedFrame.expandDims(0); // 扩展维度为 [1, 3, 640, 640]

  const predictions = model.execute(batchedFrame);
  processDetections(predictions);

  // 释放内存
  videoFrame.dispose();
  resizedFrame.dispose();
  transposedFrame.dispose();
  batchedFrame.dispose();
}

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

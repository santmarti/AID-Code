import * as sketch from "./sketch.js"

// const net = await posenet.load({
//   architecture: 'MobileNetV1',
//   outputStride: 16,
//   multiplier: 0.75,
//   inputResolution: {width: 360, height: 240},
// });
const net = await posenet.load();
// Variable that holds the latest pose prediction
var currentPose = null;
var defaultWindowSize = 5;

/**
 * CAMERA STUFF
 */
// Code adapted from https://stackoverflow.com/questions/32104975/html5-mirroring-webcam-canvas
// Grab elements, create settings, etc.
var canvas = document.getElementById("webcamCanvas");
var context = canvas.getContext("2d");
// we don't need to append the video to the document
var video = document.createElement("video");
var videoObj = navigator.getUserMedia || navigator.mozGetUserMedia ? { 
    video: {
        width: { min: 1280,  max: 1280 },
        height: { min: 720,  max: 720 },
        require: ['width', 'height']
        }
    } :
    {
    video: {
        mandatory: {
            minWidth: 1280,
            minHeight: 720,
            maxWidth: 1280,
            maxHeight: 720
        }
    }
};

// Error message callback
function errBack (error) {
    console.log("Video capture error: ", error.code); 
};

// create a crop object that will be calculated on load of the video
var crop;
// create a variable that will enable us to stop the loop.
var raf;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// Put video listeners into place
navigator.getUserMedia(videoObj, function(stream) {
    video.srcObject = stream;
    video.onplaying = function(){
        var croppedWidth = ( Math.min(video.videoHeight, canvas.height) / Math.max(video.videoHeight,canvas.height)) * Math.min(video.videoWidth, canvas.width),
        croppedX = ( video.videoWidth - croppedWidth) / 2;
        crop = {w:croppedWidth, h:video.videoHeight, x:croppedX, y:0};
        // call our loop only when the video is playing
        raf = requestAnimationFrame(loop);
    };
    video.onpause = function(){
        // stop the loop
        cancelAnimationFrame(raf);
    }
    video.play();
}, errBack);

var FilteredCoordinate = function(windowSize) {
    this.dataX = [];
    this.dataY = [];
    this.totalX = 0;
    this.totalY = 0;
    this.maxLength = windowSize;
}

FilteredCoordinate.prototype.update = function (x, y) {
    if (this.dataX.length >= this.maxLength) {
        this.dataX.push(x);
        this.totalX = this.totalX + x - this.dataX.shift();
    } else {
        this.dataX.push(x);
        this.totalX += x;
    }
    if (this.dataY.length >= this.maxLength) {
        this.dataY.push(y);
        this.totalY = this.totalY + y - this.dataY.shift();
    } else {
        this.dataY.push(y);
        this.totalY += y;
    }
}

FilteredCoordinate.prototype.getX = function() {
    // console.log(this.dataX);
    return this.totalX / this.dataX.length;
}

FilteredCoordinate.prototype.getY = function() {
    return this.totalY / this.dataX.length;
}

FilteredCoordinate.prototype.evict = function() {
    if (this.dataX.length > 0) {
        this.totalX = this.totalX - this.dataX.shift();
    }
    if (this.dataX.length > 0) {
        this.totalY = this.totalY - this.dataY.shift();
    }
}

var filter = [
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
    new FilteredCoordinate(defaultWindowSize),
];

/**
 * Animation frame callback for drawing the webcam feed + wireframe onto the canvas
 */
function loop(){
    context.drawImage(video, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
    drawWireFrame(currentPose);
    raf = requestAnimationFrame(loop);
}

/**
 * Takes a pose prediction from PoseNet and calls functions in ./sketch.js to draw the wireframe onto the canvas
 * @param {*} pose 
 */
function drawWireFrame(pose) {
    if (pose !== null) {
        sketch.drawKeypoints(pose.keypoints, 0, context);
        sketch.drawSkeleton(pose.keypoints, 0, context);
    }
}

var socket = io.connect('http://localhost:3000');

async function estimatePose(e) {
    let pose = await net.estimateSinglePose(canvas, {
        flipHorizontal: false
    });
    // console.log(pose);
    let filteredPose = filterPose(pose);
    currentPose = filteredPose;
    let poseArr = unpackPose(filteredPose);

    // Send this to local server
    socket.emit('singlePose', poseArr);
    return pose;
}

/**
 * Async recursive call that waits 33ms to update a pose prediction, for ~30fps
 */
async function predictionLoop() {
     // ~30 fps?
    setTimeout(()=>{
        estimatePose();
        predictionLoop();
    }, 33);
}

var minConfidence = 0.5

var evictionCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function filterPose(pose) {
    for (let i = 0; i < 17; i++) {
        if (pose.keypoints[i].score > minConfidence) {
            filter[i].update(pose.keypoints[i].position.x, pose.keypoints[i].position.y);
            evictionCounter[i] = 0;
        } else {
            // If we get too many low confidence predictions for a point in a row, evict one entry from that point
            evictionCounter[i]++;
            if (evictionCounter[i] >= 5) {
                filter[i].evict();
                evictionCounter[i] == 0;
            }
        }
        pose.keypoints[i].position.x = filter[i].getX() || 0;
        pose.keypoints[i].position.y = filter[i].getY() || 0;
    }
    return pose;
}

/**
 * @param {*} pose PoseNet single pose prediction 
 * @returns flattened array (length=51) of keypoints and confidence scores
 */
function unpackPose(pose) {
    let poseArr = []
    // console.log(pose.keypoints);
    for (let i = 0; i < 17; i++) {
        let keypoint = pose.keypoints[i];
        poseArr.push(Number(keypoint.position.x) / 1280.0); // Normalize for FaceTime HD Camera
        poseArr.push(Number(keypoint.position.y) / 720.0);  // Normalize for FaceTime HD Camera
    }
    // console.log(poseArr);
    return poseArr;
}

function begin() {
    // Give sketching script access to the canvas/posenet
    sketch.setCanvasAndPoseNet(canvas, posenet);
    // Begin infinite prediction loop
    setTimeout(predictionLoop, 100);
    // mirror webcam video feed
    context.translate(canvas.width, 0);
    context.scale(-1,1);
}

begin();

/**
 * Code adapted from https://github.com/googlecreativelab/posenet-sketchbook/blob/c6f101f5a3639f1defd39788d900ca9dfb044148/sketches/basic/js/sketch.js
 * 
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let canvas;
let poseDetection;
let videoWidth = 1280, videoHeight = 720;

const color = 'aqua';
const lineWidth = 5;

export function setCanvasAndPoseNet (cvs, pnt) {
  canvas = cvs;
  poseDetection = pnt;
}

function toTuple({y, x}) {
  return [y, x];
}

export function drawPoint(ctx, y, x, r, color) {
  if (y !== 0 || x !== 0) {
    ctx.beginPath();
    ctx.arc(videoWidth - x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  if (ay !== 0 && ax !== 0 && by !== 0 && bx !== 0) {
    ctx.beginPath();
    ctx.moveTo(videoWidth - ax * scale, ay * scale);
    ctx.lineTo(videoWidth - bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = poseDetection.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    );
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const {y, x} = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 10, color);
  }
}

/**
 this Processing sketch will send its mouse
 position over OSC to the p5.js sketch in the folder "p5-basic".
 you need the library OscP5 to run it.
 */
 
import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;

int N = 33;
float[] pose = new float[N];

void setup() {
  size(500, 500);
  oscP5 = new OscP5(this, 6448);  // Listen for osc in wekintor input port
  myRemoteLocation = new NetAddress("127.0.0.1", 12000);
}


void draw() {
  background(0);
  
  for(int i=0;i<N-1;i+=2) {
    circle(width*pose[i], height*pose[i+1], 10);
  }
}

void oscEvent(OscMessage theOscMessage) {
  if(theOscMessage.checkAddrPattern("/wek/inputs")==true) {
    for(int i=0;i<N;i++) {
      float value = theOscMessage.get(i).floatValue();
      pose[i] = value;
    }
  }
}

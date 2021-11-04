/**
 this Processing sketch will send its mouse
 position over OSC to the p5.js sketch in the folder "p5-basic".
 you need the library OscP5 to run it.
 */
 
import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;


void setup() {
  size(500, 500);
  oscP5 = new OscP5(this, 6448);
  myRemoteLocation = new NetAddress("127.0.0.1", 12000);
}


void draw() {
  background(0);
  
}

void oscEvent(OscMessage theOscMessage) {
  if(theOscMessage.checkAddrPattern("/part")==true) {
      int i = theOscMessage.get(0).intValue();  
      int j = theOscMessage.get(1).intValue(); 
      float x1 = theOscMessage.get(2).floatValue(); 
      float y1 = theOscMessage.get(3).floatValue(); 
      float x2 = theOscMessage.get(4).floatValue(); 
      float y2 = theOscMessage.get(5).floatValue(); 
      println(i,j,x1,y1,x2,y2);
  }
}

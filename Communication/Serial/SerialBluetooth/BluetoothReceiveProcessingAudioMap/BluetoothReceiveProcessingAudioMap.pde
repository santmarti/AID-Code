import processing.serial.*;
import processing.sound.*;

SinOsc sine;
Serial myPort;  // The serial port


void setup() {
  printArray(Serial.list());    // List all the available serial ports
  int num = 5;
  myPort = new Serial(this, Serial.list()[num], 9600);
  delay(100);
  
  sine = new SinOsc(this);
  sine.play();
}

int value=0;
int step = 0;

void draw() {
  while (myPort.available() > 0) {
    char ch = (char) myPort.read();
    if(ch == 'a') {
      delay(5);
      String str = myPort.readStringUntil(';');     
      if(str != null) {
        str = str.replaceFirst(";", ""); 
        value = Integer.parseInt(str);         
      }
    }
  }
  
  if(step % 10 == 0) {
    sine.freq(30*value);
  }
  step++;

  
}

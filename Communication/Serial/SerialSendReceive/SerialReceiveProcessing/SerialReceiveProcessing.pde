import processing.serial.*;

Serial myPort;  // The serial port

void setup() {
  printArray(Serial.list());    // List all the available serial ports
  int num = 0;                  // Choose yours here !!!!!!
  
  myPort = new Serial(this, Serial.list()[num], 9600);
}


void readSerial() {
  while (myPort.available() > 0) {
    char ch = (char) myPort.read();
    if(ch == 'c') {
      delay(4);
      String str = myPort.readStringUntil(';');
      if(str != null) {
        str = str.replaceFirst(";", "");    // remove ';' 
        int value = int(str);               // and convert to int
        println("Read String: " + str, " Converted to int: ", value);
      }
    }
  }
}



void draw() {
  readSerial();
}

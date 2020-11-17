import processing.serial.*;

Serial myPort;  // The serial port

void setup() {
  printArray(Serial.list());    // List all the available serial ports
  int num = 5;
  myPort = new Serial(this, Serial.list()[num], 9600);
  delay(500);
}

void draw() {
  while (myPort.available() > 0) {
    char ch = (char) myPort.read();
    if(ch == 'a') {
      delay(5);
      String str = myPort.readStringUntil(';');
      if(str != null) {
        str = str.substring( 0, str.length()-1 );
        int value = Integer.parseInt(str); 
        println("Read " + ch + ": " + str + "    int: " + value);
      }
    }
  }
}

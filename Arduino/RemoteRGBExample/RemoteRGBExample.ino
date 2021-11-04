#include <IRremote.h>

//Define Pins
int ledPins[] = {11,10,9};
int IR_PIN = 3;

//IR Library stuff
IRrecv irrecv(IR_PIN);
decode_results results;


// state data
int state_rgb[3] = {0,0,0};



void setPins(int* pins, int n, int value) {
  for(int i=0;i<n;i++) pinMode(pins[i], value); 
}

void setup()
{
  setPins(ledPins, 3, OUTPUT);   //Set Led Pins
  
  //Enable serial usage and IR signal in
  Serial.begin(9600);
  Serial.println("Enabling IRin...");
  irrecv.enableIRIn(); 
  Serial.println("IRin Enabled!");
}


void setRGB(int r, int g, int b) {
  state_rgb[0] = r;
  state_rgb[1] = g;
  state_rgb[2] = b;  
}

void writeRGB() {
  digitalWrite(ledPins[0], state_rgb[0]);
  digitalWrite(ledPins[1], state_rgb[1]);
  digitalWrite(ledPins[2], state_rgb[2]);  
}


void receive_IR() {
 if (irrecv.decode(&results)) {//irrecv.decode(&results) returns true if anything is recieved, and stores info in varible results
    unsigned int value = results.value; //Get the value of results as an unsigned int, so we can use switch case
    Serial.println(value);
    switch (value) {
      case 2295: setRGB(255,0,0); break;      
      case 34935: setRGB(0,255,0); break;      
      case 18615: setRGB(0,0,255); break;
      case 10455: break;
    }
    writeRGB();    
    irrecv.resume(); // Receive the next value
  }
}




void loop() {
  receive_IR();    
}
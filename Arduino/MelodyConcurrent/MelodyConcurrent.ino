
int ledPin = 13;
int butPin = 2;
int buzPins[] = {8,7,6};

int led_on = 1;
unsigned long last_led = 0;
int buttonPressed = 0;

#define Do 261
#define Re 294
#define Mi 330
#define Fa 349
#define Sol 392
#define La 440
#define Sib 466
#define Si 494
#define Do_a 523

int melody_note[] = {
  Do, Do, Re, Do, Fa, Mi, Do, Do, Re, Do, Sol, Fa, Do, Do, Do_a, 
  La, Fa, Mi, Re, Sib, Sib, La, Fa, Sol, Fa
};

int melody_duration[] = {
	8, 8, 4, 4, 4, 2, 8, 8, 4, 4, 4, 2, 8, 8, 4, 
  4, 4, 4, 2, 8, 8, 4, 4, 4, 2
};

int melody_length = 25;
int tempo = 1000;
int current_note = 0;
unsigned long last_note = 0;
unsigned long last_silence = 0;
int silence = 40;
int playing_state = 0;


void setPins(int* pins, int n, int value) {
  for(int i=0;i<n;i++) pinMode(pins[i], value); 
}

void setup() {
  pinMode(ledPin, OUTPUT); 
  pinMode(butPin, INPUT); 
  setPins(buzPins, 3, OUTPUT);   //Set Led Pins  
  Serial.begin(9600);  
  
  for(int i=0;i<melody_length;i++) {
    melody_duration[i] = (int) (tempo / melody_duration[i]);
  }
}


void playMelody() {
  if(current_note >= melody_length) { 
    noTone(buzPins[0]); 
    return;
  }
    
  if(playing_state == 0 && millis() - last_note > melody_duration[current_note]) {
    noTone(buzPins[0]);    
    last_silence = millis();
    playing_state = 1;
  }
  
  if(playing_state == 1 && millis() - last_silence > silence) {  
    current_note++;
    if(current_note < melody_length) {
      tone(buzPins[0], melody_note[current_note], melody_duration[current_note]);
    }
    last_note = millis();
    playing_state = 0;
  }
}



void ledBlink() {
  if(millis() - last_led > 500) {
    last_led = millis();
    led_on = !led_on;
    if(led_on) digitalWrite(ledPin, HIGH);
    else  digitalWrite(ledPin, LOW);
  }
}


void buttonCheck() {
 if(!buttonPressed && digitalRead(butPin) == HIGH) {
    Serial.println("RePlaying Melody");
    current_note = 0; 
    playing_state = 0;
    last_note = millis();
    buttonPressed = 1;
  }
  if(digitalRead(butPin) == LOW) buttonPressed = 0;
}


void loop()
{
  playMelody();
  ledBlink();
  buttonCheck();
  delay(4); // ONLY in Tinkercad: Delay a bit to improve simulation performance
}
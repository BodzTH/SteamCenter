#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define I2C_ADDR 0x27  // Set the LCD address to 0x27 or the address you're using
#define LCD_COLS 16    // Define the columns of your LCD
#define LCD_ROWS 2     // Define the rows of your LCD

LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLS, LCD_ROWS);  // Initialize the LCD


#define MOTION_SENSOR_PIN 4  // Define motion sensor pin

const int ledg = 13;
const int ledy = 12;
const int ledr = 11;
 
int unit_delay = 100;

void setup() {
  pinMode(ledg, OUTPUT);
  pinMode(ledy, OUTPUT);
  pinMode(ledr, OUTPUT);
  Serial.begin(9600);  // Initialize serial communication
  lcd.init();          // Initialize the LCD
  lcd.backlight();     // Turn on the backlight (if available)
  delay(500);
}

void loop() {
  
  if (Serial.available()) {
    char m = Serial.read();
    if (m == 'G') {
    lcd.clear();
    lcd.print("GREEN");
    digitalWrite(ledg, HIGH);
    delay(200);
    digitalWrite(ledg, LOW);
    delay(200);
    }
    else if (m == 'Y') {
    lcd.clear();
    lcd.print("YELLOW");
    digitalWrite(ledy, HIGH);
    delay(200);
    digitalWrite(ledy, LOW);
    delay(200);
    }
    else if (m == 'R') {
    lcd.clear();
    lcd.print("RED");
    digitalWrite(ledr, HIGH);
    delay(200);
    digitalWrite(ledr, LOW);
    delay(200);
    }
    
  }
  delay(200);
}

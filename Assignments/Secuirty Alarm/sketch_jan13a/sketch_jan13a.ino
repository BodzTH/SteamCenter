#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define I2C_ADDR 0x27  // Set the LCD address to 0x27 or the address you're using
#define LCD_COLS 16    // Define the columns of your LCD
#define LCD_ROWS 2     // Define the rows of your LCD

LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLS, LCD_ROWS);  // Initialize the LCD


#define MOTION_SENSOR_PIN 4  // Define motion sensor pin

const int led = 13;
const int buz = 8;
int unit_delay = 100;

void setup() {
  pinMode(MOTION_SENSOR_PIN, INPUT);  // Set the motion sensor pin as input
  pinMode(led, OUTPUT);
  pinMode(buz, OUTPUT);
  Serial.begin(9600);  // Initialize serial communication
  lcd.init();          // Initialize the LCD
  lcd.backlight();     // Turn on the backlight (if available)
  delay(500);
}

void loop() {

  int sensorValue = digitalRead(MOTION_SENSOR_PIN);
  if (sensorValue == HIGH) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Emshy Ya Kalb");
    lcd.setCursor(0, 1);
    lcd.print("El Ba7r");
    for (int i = 0; i < 20; i++) {
      digitalWrite(led, HIGH);
      digitalWrite(buz, HIGH);
      delay(100);
      digitalWrite(led, LOW);
      digitalWrite(buz, LOW);
      delay(100);
    }
    lcd.clear();
  }
  delay(1000);
}

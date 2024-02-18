#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <SparkFun_MAX1704x_Fuel_Gauge_Arduino_Library.h> 

#define I2C_ADDR 0x27  // Set the LCD address to 0x27 or the address you're using
#define LCD_COLS 16    // Define the columns of your LCD
#define LCD_ROWS 2     // Define the rows of your LCD

LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLS, LCD_ROWS);  // Initialize the LCD

#define DHTPIN 2       // Define DHT11 pin
#define DHTTYPE DHT11  // Define DHT type

DHT dht(DHTPIN, DHTTYPE);  // Initialize DHT sensor

void setup() {
  Serial.begin(9600);  // Initialize serial communication
  lcd.init();          // Initialize the LCD
  lcd.backlight();     // Turn on the backlight (if available)
  dht.begin();         // Start DHT sensor
  delay(500);
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();  // Read incoming command from serial

    if (command == 'D') {
      // Run DHT11 sensor project
      float humidity = dht.readHumidity();
      float temperature = dht.readTemperature();

      Serial.println("Humidity: " + String(humidity) + "% Temperature: " + String(temperature) + "C");
    } else if (command == 'L') {
      // Run LCD project
      while (!Serial.available()) {
      }  // Wait until text is available

      String text = Serial.readStringUntil('\n');  // Read text from serial until newline

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print(text);

      if (text.length() > 16) {
        lcd.setCursor(0, 1);
        lcd.print(text.substring(16));
      }
    } else if (command == 'B') {
      Serial.println("");
    }
  }
}
delay(200);
}

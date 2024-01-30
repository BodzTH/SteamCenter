#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define I2C_ADDR 0x27 // Set the LCD address to 0x27 or the address you're using
#define LCD_COLS 16   // Define the columns of your LCD
#define LCD_ROWS 2    // Define the rows of your LCD

LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLS, LCD_ROWS); // Initialize the LCD

#define DHTPIN 2            // Define DHT11 pin
#define DHTTYPE DHT11       // Define DHT type
#define MOTION_SENSOR_PIN 4 // Define motion sensor pin

DHT dht(DHTPIN, DHTTYPE); // Initialize DHT sensor

const int led = 13;
const int buz = 8;
String code = "";
int len = 0;
char ch;
char new_char;
int unit_delay = 250;

void dot()
{
  digitalWrite(led, HIGH);
  digitalWrite(buz, HIGH);
  delay(unit_delay);
  digitalWrite(led, LOW);
  digitalWrite(buz, LOW);
  delay(unit_delay);
}

void dash()
{
  digitalWrite(led, HIGH);
  digitalWrite(buz, HIGH);
  delay(unit_delay * 3);
  digitalWrite(led, LOW);
  digitalWrite(buz, LOW);
  delay(unit_delay * 3);
}

void A()
{
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}

void B()
{
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void C()
{
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void D()
{
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void E()
{
  dot();
  delay(unit_delay);
}
void f()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void G()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void H()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void I()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void J()
{
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void K()
{
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void L()
{
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void M()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void N()
{
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void O()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void P()
{
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
}
void Q()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void R()
{
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void S()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void T()
{
  dash();
  delay(unit_delay);
}
void U()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void V()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void W()
{
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void X()
{
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void Y()
{
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void Z()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void one()
{
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void two()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void three()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void four()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}
void five()
{
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void six()
{
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void seven()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void eight()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void nine()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dot();
  delay(unit_delay);
}
void zero()
{
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
  dash();
  delay(unit_delay);
}

void morse()
{
  if (ch == 'A' || ch == 'a')
  {
    A();
  }
  else if (ch == 'B' || ch == 'b')
  {
    B();
  }
  else if (ch == 'C' || ch == 'c')
  {
    C();
  }
  else if (ch == 'D' || ch == 'd')
  {
    D();
  }
  else if (ch == 'E' || ch == 'e')
  {
    E();
  }
  else if (ch == 'F' || ch == 'f')
  {
    f();
  }
  else if (ch == 'G' || ch == 'g')
  {
    G();
  }
  else if (ch == 'H' || ch == 'h')
  {
    H();
  }
  else if (ch == 'I' || ch == 'i')
  {
    I();
  }
  else if (ch == 'J' || ch == 'j')
  {
    J();
  }
  else if (ch == 'K' || ch == 'k')
  {
    K();
  }
  else if (ch == 'L' || ch == 'l')
  {
    L();
  }
  else if (ch == 'M' || ch == 'm')
  {
    M();
  }
  else if (ch == 'N' || ch == 'n')
  {
    N();
  }
  else if (ch == 'O' || ch == 'o')
  {
    O();
  }
  else if (ch == 'P' || ch == 'p')
  {
    P();
  }
  else if (ch == 'Q' || ch == 'q')
  {
    Q();
  }
  else if (ch == 'R' || ch == 'r')
  {
    R();
  }
  else if (ch == 'S' || ch == 's')
  {
    S();
  }
  else if (ch == 'T' || ch == 't')
  {
    T();
  }
  else if (ch == 'U' || ch == 'u')
  {
    U();
  }
  else if (ch == 'V' || ch == 'v')
  {
    V();
  }
  else if (ch == 'W' || ch == 'w')
  {
    W();
  }
  else if (ch == 'X' || ch == 'x')
  {
    X();
  }
  else if (ch == 'Y' || ch == 'y')
  {
    Y();
  }
  else if (ch == 'Z' || ch == 'z')
  {
    Z();
  }
  else if (ch == '0')
  {
    zero();
  }
  else if (ch == '1')
  {
    one();
  }
  else if (ch == '2')
  {
    two();
  }
  else if (ch == '3')
  {
    three();
  }
  else if (ch == '4')
  {
    four();
  }
  else if (ch == '5')
  {
    five();
  }
  else if (ch == '6')
  {
    six();
  }
  else if (ch == '7')
  {
    seven();
  }
  else if (ch == '8')
  {
    eight();
  }
  else if (ch == '9')
  {
    nine();
  }

  else if (ch == ' ')
  {
    delay(unit_delay * 7);
  }
  else if (ch == '\n')
  {
  }
  else
  {
  }
}

void String2Morse()
{
  len = code.length();
  for (int i = 0; i < len; i++)
  {
    ch = code.charAt(i);
    morse();
  }
}
void setup()
{
  pinMode(MOTION_SENSOR_PIN, INPUT); // Set the motion sensor pin as input
  pinMode(led, OUTPUT);
  pinMode(buz, OUTPUT);
  Serial.begin(9600); // Initialize serial communication
  lcd.init();         // Initialize the LCD
  lcd.backlight();    // Turn on the backlight (if available)
  dht.begin();        // Start DHT sensor
  delay(500);
}

void loop()
{
  if (Serial.available() > 0)
  {
    char command = Serial.read(); // Read incoming command from serial

    if (command == 'D')
    {
      // Run DHT11 sensor project
      float humidity = dht.readHumidity();
      float temperature = dht.readTemperature();

      Serial.println("Humidity: " + String(humidity) + "% Temperature: " + String(temperature) + "C");
    }
    else if (command == 'L')
    {
      // Run LCD project
      while (!Serial.available())
      {
      } // Wait until text is available

      String text = Serial.readStringUntil('\n'); // Read text from serial until newline

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print(text);

      if (text.length() > 16)
      {
        lcd.setCursor(0, 1);
        lcd.print(text.substring(16));
      }
    }
    else if (command == 'M')
    {
      // Run motion sensor project
      int sensorValue = digitalRead(MOTION_SENSOR_PIN);

      if (sensorValue == HIGH)
      {
        Serial.println("Motion Detected!");
      }
      else
      {
        Serial.println("No Motion Detected.");
      }
    }
    else if (command == 'B')
    {

      while (!Serial.available())
      {
      }                                    // Wait until text is available
      code = Serial.readStringUntil('\n'); // Read text from serial until newline
      String2Morse();
    }
  }
  delay(200);
}

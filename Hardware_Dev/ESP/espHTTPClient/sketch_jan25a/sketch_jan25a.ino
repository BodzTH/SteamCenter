#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

void setup()
{
  Serial.begin(9600);
  WiFi.begin("Orange-ESP01S", "esp01sardy");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("LWiFi connected");
  }
  else
  {
    Serial.println("LWiFi not connected");
  }
}

void loop()
{

  if (WiFi.status() == WL_CONNECTED)
  {
    WiFiClient wifiClient;
    HTTPClient http;

    Serial.print("D");
    String s = Serial.readStringUntil('\r');
    delay(300);

    http.begin(wifiClient, "http://192.168.1.7:5030/temphum");
    http.addHeader("Content-Type", "text/plain");
    int httpCode = http.POST(s);
    if (httpCode > 0)
    {
      Serial.println("LResponse code: " + String(httpCode));
    }
    else
    {
      Serial.println("LError: " + http.errorToString(httpCode));
    }
    http.end();
  }

  delay(200);
}
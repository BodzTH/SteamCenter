#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

void setup()
{
  Serial.begin(9600);                        // Serial connection
  WiFi.begin("Orange-ESP01S", "esp01sardy"); // WiFi connection

  while (WiFi.status() != WL_CONNECTED)
  { // Wait for the WiFI connection completion
    delay(500);
  }
}

void loop()
{
  if (WiFi.status() == WL_CONNECTED)
  { // Check WiFi connection status
    WiFiClient wifiClient;
    HTTPClient http; // Declare object of class HTTPClient

    Serial.write('D');
    String s = Serial.readStringUntil('\r');
    delay(300);

    http.begin(wifiClient, "http://192.168.1.7:5030/temphum"); // Specify request destination
    http.addHeader("Content-Type", "text/plain");              // Specify content-type header

    int httpCode = http.POST(s); // Send the request

    if (httpCode > 0)
    {
      if (httpCode == HTTP_CODE_OK)
      {
        const String &payload = http.getString();
        Serial.print('L' + "received payload");
      }
    }
    else
    {
      Serial.print('L' + "[HTTP] POST... failed");
    }
    http.end();
  }
  delay(200);
}

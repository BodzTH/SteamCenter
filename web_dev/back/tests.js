const { spawn } = require("child_process");
// Run the Python script with outputPath as an argument
const pythonProcess = spawn("python3", [
  "/home/bodz/SteamCenter/urban8K_AI_Model/classifier.py",
  "2024_Noise_Recordings/Delta1/March/Mar12_24/Noise1/Noise1.wav",
]);

// Handle output
pythonProcess.stdout.on("data", (data) => {
  console.log(`Python script output: ${data}`);
});

// Handle error
pythonProcess.stderr.on("data", (data) => {
  console.error(`Python script error: ${data}`);
});

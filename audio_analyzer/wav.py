import librosa
import numpy as np
import matplotlib.pyplot as plt

# Load the audio file
filename = "/home/bodz/SteamCenter/2024_Noise_Recordings/February/Feb29_24/Noise1/Noise1.wav"  # Make sure to put the correct path to your file
y, sr = librosa.load(filename, sr=None)  # Load with the original sampling rate

# Calculate the Short-Time Fourier Transform (STFT) and convert to decibels
D = librosa.stft(y)
D_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)

# Calculate average and peak decibel levels
avg_db = np.mean(D_db)
peak_db = np.max(D_db)

# Calculate RMS level in dB
rms = np.sqrt(np.mean(np.abs(y) ** 2))
rms_db = 20 * np.log10(rms)

# Frequency analysis to find the most prominent frequency
S, phase = librosa.magphase(D)
freqs = librosa.fft_frequencies(sr=sr, n_fft=D.shape[0])
prominent_freq_index = np.argmax(np.sum(S, axis=1))
prominent_freq = freqs[prominent_freq_index]

print(f"Average Decibel Level: {avg_db:.2f} dB")
print(f"Peak Decibel Level: {peak_db:.2f} dB")
print(f"RMS Decibel Level: {rms_db:.2f} dB")
print(f"Most Prominent Frequency: {prominent_freq:.2f} Hz")

# Optional: Plot the Spectrogram
plt.figure(figsize=(10, 4))
librosa.display.specshow(D_db, sr=sr, x_axis="time", y_axis="log", cmap="coolwarm")
plt.colorbar(format="%+2.0f dB")
plt.title("Spectrogram")
plt.tight_layout()
plt.show()

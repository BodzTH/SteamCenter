import librosa
import numpy as np

def calculate_average_decibels(audio_file):
    # Load the audio file
    y, sr = librosa.load(audio_file, sr=None)
    
    # Calculate the amplitude to power (squared amplitude)
    power = np.square(y)
    
    # Calculate the average power in the signal
    avg_power = np.mean(power)
    
    # Convert average power to decibel
    avg_db = 10 * np.log10(avg_power)
    
    return avg_db

audio_file = '2024_Noise_Recordings/March/Mar16_24/Noise1/Noise1.wav' # Update this to the path of your audio file
avg_decibels = calculate_average_decibels(audio_file)
print(f'Average Decibel Level: {avg_decibels:.2f} dB')

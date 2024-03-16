import numpy as np
from scipy.io import wavfile

def calculate_db(audio_data):
    # Convert audio data to float and handle possible zero values
    audio_data = audio_data.astype(np.float32)
    audio_data = np.maximum(audio_data, 1e-10)  # Avoid division by zero
    
    # Calculate decibel levels
    db_levels = 20 * np.log10(np.abs(audio_data))
    return np.mean(db_levels), np.max(db_levels)

def main(audio_file):
    # Read audio file
    rate, data = wavfile.read(audio_file)
    
    # Ensure the audio is mono (single-channel)
    if len(data.shape) > 1:
        data = data[:, 0]
    
    print("* Analyzing audio...")

    # Calculate average and maximum decibel levels
    avg_db, max_db = calculate_db(data)
    
    print("* Analysis finished.")
    
    print("Avg. Decibel level = {:.2f}".format(avg_db))
    print("Highest Decibel level = {:.2f}".format(max_db))
    print("Frequency = {} Hz".format(rate))

if __name__ == "__main__":
    audio_file = "drum-n-bass-loop-drum-perc-89802.wav"
    main(audio_file)

from speechbrain.inference.classifiers import EncoderClassifier

classifier = EncoderClassifier.from_hparams(
    source="speechbrain/urbansound8k_ecapa",
    savedir="pretrained_models/gurbansound8k_ecapa",
)
out_prob, score, index, text_lab = classifier.classify_file(
    "../2024_Noise_Recordings/March/Mar13_24/Noise1/Noise1.wav"
)
print(text_lab)

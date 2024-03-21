import sys
import os
from speechbrain.inference.classifiers import EncoderClassifier

output_path = sys.argv[1]
model_dir = (
    "/home/bodz/SteamCenter/urban8K_AI_Model/pretrained_models/gurbansound8k_ecapa"
)

classifier = EncoderClassifier.from_hparams(
    source="speechbrain/urbansound8k_ecapa",  # This should point to your local directory where the model is stored
    savedir=model_dir,  # Ensures that the method looks for the model files in this directory
)

out_prob, score, index, text_lab = classifier.classify_file(output_path)
print(text_lab)

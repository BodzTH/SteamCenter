import sys
from speechbrain.inference.classifiers import EncoderClassifier

output_path = sys.argv[1]
classifier = EncoderClassifier.from_hparams(
    source="speechbrain/urbansound8k_ecapa",
    savedir="pretrained_models/gurbansound8k_ecapa",
)
out_prob, score, index, text_lab = classifier.classify_file(output_path)
print(text_lab)

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

app = Flask(__name__)
CORS(app)

# Load the model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained("AhadB/bias-detector", num_labels=1)
tokenizer = AutoTokenizer.from_pretrained("AhadB/bias-detector")

# Tokenizer arguments
tokenizer_kwargs = {'padding': True, 'truncation': True, 'max_length': 512}

@app.route('/hello')
def hello():
    return "Hello"

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            # Parse JSON request body
            data = request.get_json()
            text = data.get('text')

            if not text:
                return jsonify({'error': 'No text provided'}), 400

            tokenized_text = tokenizer(text, padding="max_length", truncation=True, return_tensors="pt")
            output = model(**tokenized_text)
            predicted_label = output.logits.item()

            # Return prediction as JSON
            return jsonify(predicted_label)

        except Exception as e:
            return jsonify({'error': f'An error occurred: {e}'}), 500

    return jsonify({'error': 'Invalid request method'}), 405

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


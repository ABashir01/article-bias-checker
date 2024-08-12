from flask import Flask, request, jsonify
from flask_cors import CORS
import transformers

app = Flask(__name__)

CORS(app)


pipe = transformers.pipeline("text-classification", 
                             model="AhadB/bias-detector", 
                             tokenizer="AhadB/bias-detector", 
                             return_all_scores=True)

tokenizer_kwargs = {'padding':True,
                    'truncation':True,
                    'max_length':512}

@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()
    text = data['text']

    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        result = pipe(text, **tokenizer_kwargs)

        return jsonify(result)
    except Exception as e:
        print("Backend Error")
        return jsonify({'error': f'It over. The error was: {e}'}), 500
    
    

if __name__ == '__main__':
    app.run(port=3001, debug=True)




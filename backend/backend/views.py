from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from transformers import AutoModelForSequenceClassification, AutoTokenizer

model = AutoModelForSequenceClassification.from_pretrained("AhadB/bias-detector", num_labels=1)
tokenizer = AutoTokenizer.from_pretrained("AhadB/bias-detector")

tokenizer_kwargs = {'padding': True, 'truncation': True, 'max_length': 512}

@csrf_exempt
def predict(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text')

            if not text:
                return JsonResponse({'error': 'No text provided'}, status=400)

            tokenized_text = tokenizer(text, padding="max_length", truncation=True, return_tensors="pt")
            output = model(**tokenized_text)
            predicted_label = output.logits.item()

            return JsonResponse(predicted_label, safe=False)

        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {e}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
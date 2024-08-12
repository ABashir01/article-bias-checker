from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import transformers

pipe = transformers.pipeline("text-classification", 
                             model="AhadB/bias-detector", 
                             tokenizer="AhadB/bias-detector", 
                             return_all_scores=True)

tokenizer_kwargs = {'padding': True, 'truncation': True, 'max_length': 512}

@csrf_exempt
def predict(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text')

            if not text:
                return JsonResponse({'error': 'No text provided'}, status=400)

            # Use the model pipeline to make predictions
            result = pipe(text, **tokenizer_kwargs)
            return JsonResponse(result, safe=False)

        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {e}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
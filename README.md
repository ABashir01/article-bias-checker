# Article Bias Checker

A website that can give you an AI-estimate of the political bias of a text. Located at [https://biascheck.netlify.app/](url)

## Description

The motivation for this was to create a text classifier that was able to distinguish the political bias of a given piece of text. It was fine-tuned on 700,000+ political articles which were all labeled based on AllSides's political bias ratings of the given news organization. The pretrained transformer that was fine-tuned for this task was Google's Bert (specifically, bert-base-uncased from the Hugging Face Hub). 

## Technologies Used
 - React.js
 - Python (Flask)
 - Pytorch (Transformers)
 - 
### Dependencies

Npm and pip are required. Run 'npm install' in the  'frontend' to install the dependencies. Run 'pip install -r requirements.txt' in the backend to install dependencies.

### Executing program

* To run the backend, navigate to the backend directory, then run "python app.py"
* To run the frontend, navigate to the frontend directory, then run "npm run start"

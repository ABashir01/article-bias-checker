# Article Bias Checker

A website that can give you an AI-estimate of the political bias of a text. Located at [https://biascheck.xyz/](https://biascheck.xyz/).

## Credit

**NELA-GT-2022 Dataset (for the article text):**

Gruppi, M., Horne, B. D., & Adalı, S. (2023). NELA-GT-2022: A Large Multi-Labelled News Dataset for The Study of Misinformation in News Articles. https://arxiv.org/abs/2203.05659


**AllSides (for the bias scores):**

[https://www.allsides.com](https://www.allsides.com)
## Description

The motivation for this was to create a text classifier that was able to distinguish the political bias of a given piece of text. It was fine-tuned on 700,000+ political articles which were all labeled based on AllSides's political bias ratings of the given news organization. The pretrained transformer that was fine-tuned for this task was Google's Bert (specifically, bert-base-uncased from the Hugging Face Hub). The fine-tuned model is now available at [https://huggingface.co/AhadB/bias-detector](https://huggingface.co/AhadB/bias-detector) 

**NOTE: I didn't include the data here because it utilized text from the NELA-GT-2022 dataset which I promised to not share**

## Technologies Used
 - React.js
 - Python (Flask)
 - Pytorch (Transformers)

### Dependencies

Npm and pip are required. Run 'npm install' in the  'frontend' to install the dependencies. Run 'pip install -r requirements.txt' in the backend to install dependencies.

### Executing program

* To run the backend, navigate to the backend directory, then run "python app.py"
* To run the frontend, navigate to the frontend directory, then run "npm run start"
* The training script can just be ran as a python file if you have a dataset that maps text to a "bias score"

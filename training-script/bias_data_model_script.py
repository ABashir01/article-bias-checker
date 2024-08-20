import numpy as np
import evaluate
import transformers
import datasets
import torch

print("torch.cuda.is_available(): ", torch.cuda.is_available())


# LOADING THE DATA -------------------------------------------------------------

training_path = "data/news_bias_training_data.csv"
testing_path = "data/news_bias_testing_data.csv"

data_files = {"train": training_path, "test": testing_path}

# Loads training and testing dataset
my_data = datasets.load_dataset("csv", data_files=data_files, sep=",")

print("Done loading data")

# ------------------------------------------------------------------------------


# PROCESSING THE DATA ----------------------------------------------------------

# Define the renaming function
def rename_features(example):
    return {
        "text": example["content"],  # Renaming "content" to "text"
        "label": example["rating"]   # Renaming "rating" to "label"
    }

# Apply the renaming function to each example
my_data = my_data.map(rename_features)

# Remove the original columns
my_data = my_data.remove_columns(["content", "rating"])

tokenizer = transformers.AutoTokenizer.from_pretrained("google-bert/bert-base-uncased")

def tokenize_function(examples):
    return tokenizer([str(text) for text in examples["text"]], padding="max_length", truncation=True)

def convert_labels_to_floats_and_normalize(example):
    example["label"] = (float(example["label"])) / 5.0
    return example

training_dataset, evaluation_dataset = my_data["train"].train_test_split(test_size=0.2).values()
testing_dataset = my_data["test"]

# Select from a range to reduce training time
training_dataset = training_dataset.shuffle(seed=21).map(tokenize_function, batched=True).map(convert_labels_to_floats_and_normalize)
evaluation_dataset = evaluation_dataset.shuffle(seed=21).map(tokenize_function, batched=True).map(convert_labels_to_floats_and_normalize)
testing_dataset = testing_dataset.shuffle(seed=21).map(tokenize_function, batched=True).map(convert_labels_to_floats_and_normalize)

print("Done processing data")

# ------------------------------------------------------------------------------


# TRAINING THE MODEL -----------------------------------------------------------

model = transformers.AutoModelForSequenceClassification.from_pretrained("google-bert/bert-base-uncased", num_labels=1, hidden_dropout_prob=0.2)

training_args = transformers.TrainingArguments(
    output_dir="output/bias_data_model_results_6",
    per_device_train_batch_size=32,
    per_device_eval_batch_size=32,
    evaluation_strategy="epoch",
    num_train_epochs=3,
    weight_decay=0.0001,
    learning_rate=5e-5,
    )

metric = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return metric.compute(predictions=predictions, references=labels)

trainer = transformers.Trainer(
    model=model,
    args=training_args,
    train_dataset=training_dataset,
    eval_dataset=evaluation_dataset,
    compute_metrics=compute_metrics,
    tokenizer=tokenizer
)

trainer.train()
trainer.save_model(f"output/bias_data_model_results_6_best_model")

print("Done training model")

trainer.evaluate(testing_dataset)

print("Done testing model")

# ------------------------------------------------------------------------------

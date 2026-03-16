"""
Loads all ML models and NLP resources into memory at startup.
Models are stored in a global dictionary accessible by all services.
"""

import json
import os
import ssl

import joblib
import nltk
import pandas as pd
from nltk.corpus import words as nltk_words
from nltk.sentiment import SentimentIntensityAnalyzer

from ..config import DATA_DIR

# Global dictionary to hold all AI models in memory
ml_resources = {}


def load_nltk_resources():
    """Load NLTK models for sentiment analysis."""
    print("-> Checking NLTK resources...")
    try:
        nltk.data.find('sentiment/vader_lexicon.zip')
        nltk.data.find('tokenizers/punkt')
        nltk.data.find('tokenizers/punkt_tab')
        nltk.data.find('corpora/stopwords')
        nltk.data.find('corpora/words')
    except LookupError:
        print("-> Downloading missing NLTK resources...")
        try:
            _create_unverified_https_context = ssl._create_unverified_context
        except AttributeError:
            pass
        else:
            ssl._create_default_https_context = _create_unverified_https_context
        nltk.download('vader_lexicon', quiet=True)
        nltk.download('punkt', quiet=True)
        nltk.download('punkt_tab', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('words', quiet=True)

    ml_resources["english_vocab"] = set(w.lower() for w in nltk_words.words())
    ml_resources["sia"] = SentimentIntensityAnalyzer()
    print("NLTK models loaded.")


def load_recommendation_models():
    """Load KNN model, user-item matrix, and supporting JSON files."""
    print("-> Loading recommendation models...")
    ml_resources["knn_model"] = joblib.load(os.path.join(DATA_DIR, 'knn_model.pkl'))
    ml_resources["user_item_matrix"] = pd.read_pickle(os.path.join(DATA_DIR, 'user_item_matrix.pkl'))

    with open(os.path.join(DATA_DIR, 'item_canteen_map.json'), 'r') as f:
        ml_resources["item_canteen_map"] = json.load(f)
    with open(os.path.join(DATA_DIR, 'time_rules.json'), 'r') as f:
        ml_resources["time_rules"] = json.load(f)

    print("Recommendation models loaded.")


def load_discount_models():
    """Load pre-computed discount strategy rules."""
    print("-> Loading discount models...")
    with open(os.path.join(DATA_DIR, 'combo_rules.json'), 'r') as f:
        ml_resources["combo_rules"] = json.load(f)
    with open(os.path.join(DATA_DIR, 'failing_items.json'), 'r') as f:
        ml_resources["failing_items"] = json.load(f)
    with open(os.path.join(DATA_DIR, 'bogo_rules.json'), 'r') as f:
        ml_resources["bogo_rules"] = json.load(f)
    print("Discount models loaded.")


def load_all():
    """Load all models. Called during app startup."""
    print("Starting up: Loading AI models into memory...")

    try:
        load_nltk_resources()
    except Exception as e:
        print(f"Warning: Could not load NLTK models: {e}")

    try:
        load_recommendation_models()
    except Exception as e:
        print(f"Warning: Could not load recommendation models: {e}")

    try:
        load_discount_models()
    except Exception as e:
        print(f"Warning: Could not load discount models: {e}")
        ml_resources["combo_rules"] = {}
        ml_resources["failing_items"] = {}
        ml_resources["bogo_rules"] = {}

    print("AI Service is fully booted and ready!")


def unload_all():
    """Clear all models from memory. Called during app shutdown."""
    print("Shutting down: Clearing ALL models from memory...")
    ml_resources.clear()

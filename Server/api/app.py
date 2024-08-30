from flask import Flask, request, jsonify, Response
import tensorflow as tf
from tensorflow import keras
from keras.models import load_model
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import mediapipe as mp
import os
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": ["https://ai-vision.onrender.com"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
    "supports_credentials": True
}})

# Load models lazily
model_age = None
model_emotion = None
model_gender = None

def load_models():
    global model_age, model_emotion, model_gender
    if model_age is None:
        model_age = load_model('../models/best_age_model.keras')
    if model_emotion is None:
        model_emotion = load_model('../models/best_emotion_model.keras')
    if model_gender is None:
        model_gender = load_model('../models/best_gender_model.keras')

# Constants
GENDER_DICT = {0: 'Male \u2642', 1: 'Female \u2640'}
EMOTION_LABELS = ['Angry', 'Happy', 'Neutral', 'Sad', 'Surprised']
EMOTION_EMOJIS = {
    'Angry': ('Angry 😠', (255, 0, 0)),
    'Happy': ('Happy 😃', (0, 255, 0)),
    'Neutral': ('Neutral 😐', (255, 255, 255)),
    'Sad': ('Sad 😢', (0, 0, 255)),
    'Surprised': ('Surprised 😲', (255, 255, 0))
}

# Initialize MediaPipe Face Detection
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)

# Path to the Segoe UI Emoji font (on Windows)
FONT_PATH = 'C:/Windows/Fonts/seguiemj.ttf'

def preprocess_image(img):
    try:
        # Resize large images
        max_size = 256  # Reduced from 512 to 256
        h, w = img.shape[:2]
        if h > max_size or w > max_size:
            scale = max_size / max(h, w)
            img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

        # Convert the BGR image to RGB
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb_img)

        if results.detections:
            detection = results.detections[0]
            bboxC = detection.location_data.relative_bounding_box
            ih, iw, _ = img.shape
            x, y, w, h = int(bboxC.xmin * iw), int(bboxC.ymin * ih), \
                         int(bboxC.width * iw), int(bboxC.height * ih)
            face = img[y:y+h, x:x+w]
        else:
            return None, None

        face = cv2.resize(face, (128, 128), interpolation=cv2.INTER_AREA)
        face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        face = face.astype('float32') / 255.0
        face = np.expand_dims(face, axis=-1)
        face = np.expand_dims(face, axis=0)
        
        return face, (x, y, w, h)
    
    except Exception as e:
        logging.error(f"Error in preprocessing image: {str(e)}")
        return None, None

def predict_gender_age_emotion(img):
    """Predict gender, age, and emotion from an image"""
    processed_img, face_bbox = preprocess_image(img)
    
    if processed_img is None:
        return None, None

    load_models()  # Lazy load models

    pred_gender = model_gender.predict(processed_img, verbose=0)
    pred_age = model_age.predict(processed_img, verbose=0)
    pred_emotion = model_emotion.predict(processed_img, verbose=0)

    # Gender prediction
    gender_value = pred_gender[0][0]
    gender_label = GENDER_DICT[1 if gender_value > 0.7 else 0]
    gender_confidence = max(gender_value, 1 - gender_value)

    # Age prediction
    age_value = max(1, pred_age[0][0])
    range_width = max(2, int(0.05 * age_value))
    age_lower = max(1, int(age_value - range_width))
    age_upper = int(age_value + range_width)
    age_confidence = max(0, min(1, 1 - (range_width / age_value) if age_value > 0 else 0))

    # Emotion prediction
    emotion_probabilities = pred_emotion[0]
    emotion_index = np.argmax(emotion_probabilities)
    emotion_label = EMOTION_LABELS[emotion_index]
    emotion_confidence = np.max(emotion_probabilities)

    return {
            'gender': gender_label,
            'gender_confidence': f"{gender_confidence * 100:.2f}%",
            'age_range': f"{age_lower}-{age_upper}",
            'age_confidence': f"{age_confidence * 100:.2f}%",
            'emotion': emotion_label,
            'emotion_confidence': f"{emotion_confidence * 100:.2f}%"
        }, face_bbox

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__) 

# Routes
@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/predict-image', methods=['POST'])
def predict_image():
    logger.info(f"Received request: {request.method} {request.url}")

    if 'file' not in request.files:
        logger.error("No file uploaded")
        return jsonify({'error': 'No file uploaded'}), 400  

    file = request.files['file']
    logger.info(f"File received: {file.filename}")

    try:
        # Read the file into a numpy array
        file_bytes = np.frombuffer(file.read(), np.uint8)
        logger.info(f"File size: {len(file_bytes)} bytes")
        
        # Decode the image, forcing 3 channels (BGR)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if img is None:
            logger.error("Error: Invalid image format")
            return jsonify({'error': 'Invalid image format'}), 400

        # Predict gender, age, and emotion
        prediction, _ = predict_gender_age_emotion(img)
        if prediction:
            logger.info(f"Prediction: {prediction}")
            return jsonify(prediction)
        else:
            logger.error("Error: No face detected")
            return jsonify({'error': 'No face detected'}), 400
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500    

if __name__ == '__main__':
    app.run(debug=False)
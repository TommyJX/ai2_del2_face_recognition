from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import os
from celery import Celery

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load models
model_age = load_model('../models/best_age_model.keras')
model_emotion = load_model('../models/best_emotion_model.keras')
model_gender = load_model('../models/best_gender_model.keras')

# Labels for gender and emotion predictions
gender_dict = {0: 'Male', 1: 'Female'}
emotion_labels = ['Angry', 'Happy', 'Neutral', 'Sad', 'Surprised']

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def preprocess_image(img):
    # Convert image to grayscale for better detection
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Adjust the parameters for better face detection
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.05,   # Increase sensitivity by reducing the scale factor
        minNeighbors=3,     # Decrease minNeighbors to allow for more detections
        minSize=(20, 20)    # Reduce the minimum size to detect smaller faces
    )

    print(f"Faces detected: {len(faces)}")

    if len(faces) > 0:
        (x, y, w, h) = faces[0]  # Get the first face detected
        face = gray[y:y+h, x:x+w]
        face = cv2.resize(face, (128, 128))
        face = face / 255.0  # Normalize pixel values
        face = np.expand_dims(face, axis=-1)  # Add channel dimension (for grayscale)
        face = np.expand_dims(face, axis=0)  # Add batch dimension
        return face, (x, y, w, h)
    else:
        print("Error: No face detected")
        return None, None

def predict_gender_age_emotion(img):
    """Predict gender, age, and emotion from an image"""
    processed_img, face_bbox = preprocess_image(img)
    
    if processed_img is not None:
        pred_gender = model_gender.predict(processed_img)
        pred_age = model_age.predict(processed_img)
        pred_emotion = model_emotion.predict(processed_img)

        # Gender prediction
        gender_value = pred_gender[0][0]
        gender_label = gender_dict[1 if gender_value > 0.7 else 0]
        gender_confidence = max(gender_value, 1 - gender_value)

        # Age prediction with range and confidence
        age_value = max(1, pred_age[0][0])
        range_width = max(2, int(0.05 * age_value))  # 5% of the predicted age, minimum range of 2
        age_lower = max(1, int(age_value - range_width))
        age_upper = int(age_value + range_width)
        age_confidence = 1 - (range_width / age_value) if age_value > 0 else 0
        age_confidence = max(0, min(1, age_confidence))  # Keep confidence between 0 and 1

        # Emotion prediction with confidence
        emotion_probabilities = pred_emotion[0]
        emotion_index = np.argmax(emotion_probabilities)
        emotion_label = emotion_labels[emotion_index]
        emotion_confidence = np.max(emotion_probabilities)

        return {
            'gender': gender_label,
            'gender_confidence': f"I am {gender_confidence * 100:.2f}% confident in the accuracy of the gender prediction.",
            'age_range': f"{age_lower}-{age_upper}",
            'age_confidence': f"My confidence in the age prediction is approximately {age_confidence * 100:.2f}%.",
            'emotion': emotion_label,
            'emotion_confidence': f"I am {emotion_confidence * 100:.2f}% confident in this emotion prediction."
        }, face_bbox
    else:
        return None, None

@app.route('/')
def home():
    return "Flask server is running!"

# Route for image upload prediction
@app.route('/predict-image', methods=['POST'])
def predict_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    print(f"File received: {file.filename}")  # Log file name

    try:
        # Read image using OpenCV
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        if img is None:
            print("Error: Invalid image format")
            return jsonify({'error': 'Invalid image format'}), 400
        else:
            print("Image successfully decoded")

        prediction, face_bbox = predict_gender_age_emotion(img)
        if prediction:
            print(f"Prediction: {prediction}")
            return jsonify(prediction)
        else:
            print("Error: No face detected")
            return jsonify({'error': 'No face detected'}), 400
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': 'Error processing image'}), 500

# Celery setup for real-time prediction
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)
    return celery

app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379/0',
    CELERY_RESULT_BACKEND='redis://localhost:6379/0'
)

celery = make_celery(app)

@celery.task
def run_real_time_prediction():
    """Run real-time prediction via Celery"""
    os.system('jupyter nbconvert --to notebook --execute ../notebooks/real_time_prediction.ipynb')
    return "Real-time prediction completed"

@app.route('/predict-realtime', methods=['GET'])
def predict_realtime():
    """Start real-time prediction"""
    task = run_real_time_prediction.delay()
    return jsonify({'message': 'Real-time prediction started', 'task_id': task.id})

@app.route('/task-status/<task_id>')
def task_status(task_id):
    """Check Celery task status"""
    task = run_real_time_prediction.AsyncResult(task_id)
    if task.state == 'PENDING':
        return jsonify({'status': 'Pending...'})
    elif task.state == 'SUCCESS':
        return jsonify({'status': 'Completed', 'result': task.result})
    else:
        return jsonify({'status': task.state})

if __name__ == '__main__':
    app.run(debug=True)
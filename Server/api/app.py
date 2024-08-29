from flask import Flask, request, jsonify, Response
import tensorflow as tf
from tensorflow.keras.models import load_model
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import mediapipe as mp

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load models
model_age = load_model('../models/best_age_model.keras')
model_emotion = load_model('../models/best_emotion_model.keras')
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

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Initialize MediaPipe Face Detection
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)

# Path to the Segoe UI Emoji font (on Windows)
FONT_PATH = 'C:/Windows/Fonts/seguiemj.ttf'

def preprocess_image(img, use_mediapipe=False):
    """Preprocess the image to detect face and crop it."""
    # Ensure the image is in the correct format
    if len(img.shape) == 2:  # If grayscale, convert to BGR
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    elif img.shape[2] == 4:  # If RGBA, convert to BGR
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
    
    if use_mediapipe:
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
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=5, minSize=(50, 50))
        if len(faces) > 0:
            (x, y, w, h) = faces[0]
            face = gray[y:y+h, x:x+w]
        else:
            return None, None

    face = cv2.resize(face, (128, 128))
    face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    face = face.astype('float32') / 255.0
    face = np.expand_dims(face, axis=-1)
    face = np.expand_dims(face, axis=0)    
    return face, (x, y, w, h)

def predict_gender_age_emotion(img, use_mediapipe=False):
    """Predict gender, age, and emotion from an image"""
    processed_img, face_bbox = preprocess_image(img, use_mediapipe)
    
    if processed_img is None:
        return None, None

    pred_gender = model_gender.predict(processed_img)
    pred_age = model_age.predict(processed_img)
    pred_emotion = model_emotion.predict(processed_img)

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
            'gender_confidence': f"I am {gender_confidence * 100:.2f}% confident in the accuracy of the gender prediction.",
            'age_range': f"{age_lower}-{age_upper}",
            'age_confidence': f"My confidence in the age prediction is approximately {age_confidence * 100:.2f}%.",
            'emotion': emotion_label,
            'emotion_confidence': f"I am {emotion_confidence * 100:.2f}% confident in this emotion prediction."
        }, face_bbox

def apply_blur(frame, background_position):
    """Apply Gaussian blur to a specific region of the image."""
    pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    region = pil_image.crop(background_position)
    blurred_region = region.filter(ImageFilter.GaussianBlur(radius=20))
    pil_image.paste(blurred_region, background_position)
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

def draw_text_with_pillow(frame, text, position, font_path=FONT_PATH, font_size=30, text_color=(255, 255, 255), padding=10):
    """Draw text on the image using Pillow with emoji support and blurred background."""
    pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_image)
    font = ImageFont.truetype(font_path, font_size)
    
    text_bbox = draw.textbbox(position, text, font=font)
    text_size = (text_bbox[2] - text_bbox[0], text_bbox[3] - text_bbox[1])
    
    background_position = [position[0] - padding, position[1] - padding, position[0] + text_size[0] + padding, position[1] + text_size[1] + padding]
    frame = apply_blur(frame, background_position)
    
    draw.text(position, text, font=font, fill=text_color)
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

def generate_frames():
    """Generate frames from the webcam with predictions for real-time streaming."""
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break

        prediction, face_bbox = predict_gender_age_emotion(frame, use_mediapipe=True)

        if prediction:
            emotion_text, emotion_color = EMOTION_EMOJIS[prediction['emotion']]
            
            text_start_x, text_start_y = 10, 30
            line_spacing = 40

            frame = draw_text_with_pillow(frame, f"Emotion: {emotion_text}", (text_start_x, text_start_y), text_color=emotion_color, font_size=30)
            frame = draw_text_with_pillow(frame, f"Gender: {prediction['gender']}", (text_start_x, text_start_y + line_spacing), text_color=(255, 165, 0), font_size=28)
            frame = draw_text_with_pillow(frame, f"Age: {prediction['age_range']}", (text_start_x, text_start_y + 2 * line_spacing), text_color=(255, 250, 205), font_size=28)

        if face_bbox:
            (x, y, w, h) = face_bbox
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Routes
@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/predict-image', methods=['POST'])
def predict_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400  

    file = request.files['file']
    print(f"File received: {file.filename}")

    try:
        # Read the file into a numpy array
        file_bytes = np.frombuffer(file.read(), np.uint8)
        # Decode the image, forcing 3 channels (BGR)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if img is None:
            print("Error: Invalid image format")
            return jsonify({'error': 'Invalid image format'}), 400

        # Predict gender, age, and emotion
        prediction, _ = predict_gender_age_emotion(img, use_mediapipe=True)
        if prediction:
            print(f"Prediction: {prediction}")
            return jsonify(prediction)
        else:
            print("Error: No face detected")
            return jsonify({'error': 'No face detected'}), 400
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/predict-realtime')
def predict_realtime():
    """Stream the video feed with predictions overlaid."""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
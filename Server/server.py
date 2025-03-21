from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

# Knowledge base for Blood Pressure
bp_knowledge_base = {
    "Hypotension Stage 2": {
        "Symptoms": [
            "Severe dizziness", "Fainting", "Shock", "Cold, clammy skin",
            "Blurred vision", "Confusion", "Rapid, shallow breathing"
        ],
        "Precautions": [
            "Seek immediate medical attention", "Avoid sudden posture changes",
            "Increase fluid and salt intake (if recommended)", "Wear compression stockings"
        ],
        "Diet": [
            "Salty foods (in moderation)", "Caffeine (temporary BP boost)",
            "Nuts, seeds, and whole grains", "Lean proteins like chicken and fish"
        ],
        "Exercises": [
            "Seated leg raises", "Slow walking", "Mild yoga", "Stretching exercises"
        ],
        "Prone Diseases": [
            "Shock", "Heart failure", "Kidney diseases", "Neurological disorders"
        ],
        "Recommendations": "Seek emergency medical attention immediately."
    },

    "Hypotension Stage 1": {
        "Symptoms": [
            "Dizziness", "Fatigue", "Lightheadedness", "Blurred vision",
            "Cold extremities", "Nausea"
        ],
        "Precautions": [
            "Avoid prolonged standing", "Stay hydrated", "Increase salt intake (if advised)",
            "Avoid alcohol", "Rise slowly from sitting/lying positions"
        ],
        "Diet": [
            "Slightly increased salt intake", "Caffeinated drinks", "Hydrating fruits (watermelon, oranges)",
            "Protein-rich foods"
        ],
        "Exercises": [
            "Mild stretching", "Slow walking", "Breathing exercises", "Low-intensity yoga"
        ],
        "Prone Diseases": [
            "Chronic fatigue syndrome", "Neurological disorders", "Anemia"
        ],
        "Recommendations": "Monitor symptoms and consult a doctor if dizziness persists."
    },

    "Normal Blood Pressure": {
        "Symptoms": [
            "No major symptoms", "Overall well-being"
        ],
        "Precautions": [
            "Maintain a balanced diet", "Exercise regularly", "Monitor BP occasionally"
        ],
        "Diet": [
            "Fruits and vegetables", "Whole grains", "Lean proteins", "Low-fat dairy"
        ],
        "Exercises": [
            "Brisk walking", "Jogging", "Cycling", "Strength training"
        ],
        "Prone Diseases": [
            "Minimal risk of BP-related diseases"
        ],
        "Recommendations": "Maintain a healthy lifestyle and check BP annually."
    },

    "Prehypertension": {
        "Symptoms": [
            "No noticeable symptoms", "Occasional mild headaches", "Increased heart rate"
        ],
        "Precautions": [
            "Reduce salt intake", "Limit caffeine and alcohol", "Manage stress",
            "Maintain a healthy weight", "Exercise regularly"
        ],
        "Diet": [
            "Leafy greens", "Berries", "Whole grains", "Low-fat dairy",
            "Reduce processed and salty foods"
        ],
        "Exercises": [
            "Brisk walking", "Light cardio", "Yoga", "Breathing exercises"
        ],
        "Prone Diseases": [
            "Heart diseases", "Stroke", "Kidney diseases"
        ],
        "Recommendations": "Adopt a healthier lifestyle; consult a doctor if BP rises further."
    },

    "Hypertension Stage 1": {
        "Symptoms": [
            "Mild headaches", "Dizziness", "Fatigue", "Nosebleeds (rare)"
        ],
        "Precautions": [
            "Reduce sodium intake", "Quit smoking and alcohol", "Exercise regularly",
            "Monitor BP frequently"
        ],
        "Diet": [
            "Low-sodium diet", "High-fiber foods", "Potassium-rich foods (bananas, spinach)",
            "Lean proteins"
        ],
        "Exercises": [
            "Brisk walking", "Swimming", "Light weight training", "Aerobic exercises"
        ],
        "Prone Diseases": [
            "Atherosclerosis", "Heart diseases", "Kidney diseases"
        ],
        "Recommendations": "Consult a doctor for proper management and lifestyle modifications."
    },

    "Hypertension Stage 2": {
        "Symptoms": [
            "Frequent headaches", "Shortness of breath", "Dizziness", "Chest discomfort"
        ],
        "Precautions": [
            "Strict sodium control", "Avoid processed foods", "Reduce stress",
            "Maintain a healthy lifestyle"
        ],
        "Diet": [
            "DASH diet (low sodium, high potassium)", "Whole grains", "Leafy greens",
            "Low-fat dairy", "Limit red meat"
        ],
        "Exercises": [
            "Walking", "Cycling", "Swimming", "Strength training (moderate intensity)"
        ],
        "Prone Diseases": [
            "Heart attack", "Stroke", "Chronic kidney diseases"
        ],
        "Recommendations": "Schedule a doctor’s appointment as soon as possible."
    },

    "Hypertension Stage 3": {
        "Symptoms": [
            "Severe headaches", "Blurred vision", "Chest pain", "Fatigue", "Nosebleeds",
            "Dizziness"
        ],
        "Precautions": [
            "Regular BP monitoring", "Strict medication adherence", "Reduce stress",
            "Avoid smoking and alcohol"
        ],
        "Diet": [
            "Very low-sodium diet", "Fresh vegetables and fruits", "Lean proteins",
            "Avoid high-fat and processed foods"
        ],
        "Exercises": [
            "Walking", "Low-impact aerobics", "Breathing exercises", "Light resistance training"
        ],
        "Prone Diseases": [
            "Heart failure", "Stroke", "Vision loss", "Kidney diseases"
        ],
        "Recommendations": "Urgently consult a doctor and follow prescribed medications."
    },

    "Hypertensive Crisis": {
        "Symptoms": [
            "Severe headaches", "Chest pain", "Shortness of breath",
            "Vision problems", "Seizures", "Confusion"
        ],
        "Precautions": [
            "Seek emergency medical care immediately", "Avoid any exertion",
            "Lie down and stay calm", "Take prescribed medications (if applicable)"
        ],
        "Diet": [
            "No immediate dietary changes (seek medical help first)", "Follow a strict low-sodium diet after stabilization"
        ],
        "Exercises": [
            "No physical activity until BP stabilizes", "Gradual introduction of light walking after medical approval"
        ],
        "Prone Diseases": [
            "Organ failure", "Stroke", "Heart attack", "Brain hemorrhage"
        ],
        "Recommendations": "Seek emergency medical attention immediately!"
    }
}



app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model pipeline
MODEL_PATH = "model.pkl"
with open(MODEL_PATH, "rb") as f:
    model_pipeline = pickle.load(f)

# Define feature names
num_features = ["age", "restingBP", "serumcholestrol", "maxheartrate", "oldpeak"]
cat_features = ["gender", "chestpain", "fastingbloodsugar", "restingrelectro", "exerciseangia", "slope", "noofmajorvessels"]
all_features = num_features + cat_features

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        input_data = [data[feature] for feature in all_features]
        
        # Convert to DataFrame
        input_df = pd.DataFrame([input_data], columns=model_pipeline.feature_names_in_)

        # Make prediction using the model
        prediction = model_pipeline.predict(input_df)[0]

        # Extract SBP and DBP
        sbp = int(data.get("sbp"))
        dbp = int(data.get("dbp"))

        # Determine BP stage using if-then rules (higher category selected)
        if sbp >= 180 or dbp >= 110:
            bp_stage = "Hypertensive Crisis"
        elif sbp >= 160 or dbp >= 100:
            bp_stage = "Hypertension Stage 3"
        elif sbp >= 140 or dbp >= 90:
            bp_stage = "Hypertension Stage 2"
        elif sbp >= 130 or dbp >= 80:
            bp_stage = "Hypertension Stage 1"
        elif sbp >= 120 and dbp < 80:
            bp_stage = "Prehypertension"
        elif sbp >= 90 and dbp >= 60:
            bp_stage = "Normal Blood Pressure"
        else:
            bp_stage = "Hypotension Stage 2" if sbp < 80 or dbp < 50 else "Hypotension Stage 1"

        # Retrieve BP stage details from the knowledge base
        bp_info = bp_knowledge_base.get(bp_stage, {})

        return jsonify({
            "prediction": int(prediction),
            "bp_stage": bp_stage,
            "bp_info": bp_info
        })

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)

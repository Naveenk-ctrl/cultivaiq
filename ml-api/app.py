from flask import Flask, jsonify, request
import os
import joblib
import numpy as np

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

crop_model = joblib.load(os.path.join(MODELS_DIR, "crop_model.pkl"))
crop_scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
crop_label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/predict")
def predict_disease():
    payload = request.get_json(silent=True) or {}
    image_path = payload.get("imagePath")
    if not image_path:
        image_path = payload.get("filename")
    if not image_path and payload.get("imageBase64"):
        image_path = "inline-upload"
    if not image_path:
        image_path = "unknown"
    return jsonify({
        "imagePath": image_path,
        "disease": "Leaf Blight",
        "confidence": 0.92,
        "advice": "Remove infected leaves and avoid overhead irrigation."
    })

@app.post("/crop-recommendation")
def crop_recommendation():
    payload = request.get_json(silent=True) or {}
    required_fields = [
        "nitrogen",
        "phosphorus",
        "potassium",
        "temperature",
        "humidity",
        "ph",
        "rainfall"
    ]

    missing = [field for field in required_fields if field not in payload]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        features = np.array(
            [[
                float(payload["nitrogen"]),
                float(payload["phosphorus"]),
                float(payload["potassium"]),
                float(payload["temperature"]),
                float(payload["humidity"]),
                float(payload["ph"]),
                float(payload["rainfall"])
            ]]
        )
        scaled = crop_scaler.transform(features)
        prediction = crop_model.predict(scaled)
        crop_label = crop_label_encoder.inverse_transform(prediction)[0]
    except Exception as exc:
        return jsonify({"message": f"Prediction failed: {exc}"}), 500

    return jsonify({
        "input": payload,
        "recommendedCrop": str(crop_label),
        "notes": "Based on your soil nutrients, weather, and rainfall."
    })

@app.post("/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "")
    return jsonify({
        "message": message,
        "response": "I can help with crop health and weather tips."
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)

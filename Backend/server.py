from flask import Flask, Response
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS,cross_origin
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
app = Flask(__name__)


CORS(app)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/overlaysDB"
mongo = PyMongo(app)

@app.route('/overlays', methods=['POST'])
@cross_origin()
def create_overlay():
    data = request.json
    overlay_id = mongo.db.overlays.insert_one(data).inserted_id
    return jsonify({"id": str(overlay_id)}), 201

# Read all overlays
@app.route('/overlays', methods=['GET'])
@cross_origin()  # This allows CORS for this specific route
def get_overlays():
    overlays = mongo.db.overlays.find()
    return jsonify([{"id": str(overlay["_id"]), "content": overlay.get("text"), "x": overlay.get("x"), "y": overlay.get("y"),"size": overlay.get("size")} for overlay in overlays]), 200


# Update an overlay
@app.route('/overlays/<id>', methods=['PUT'])
@cross_origin()
def update_overlay(id):
    data = request.json
    mongo.db.overlays.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"id": id}), 200

# Delete an overlay
@app.route('/overlays/<id>', methods=['DELETE'])
@cross_origin()
def delete_overlay(id):
    mongo.db.overlays.delete_one({"_id": ObjectId(id)})
    return jsonify({"id": id}), 204


# Replace with your RTSP stream URL
rtsp_url = "your rtsp url"

def generate_frames():
    cap = cv2.VideoCapture(rtsp_url)  # Open the RTSP stream

    if not cap.isOpened():
        print("Error: Unable to open the RTSP stream.")
        return

    while True:
        # Read a frame from the video capture
        success, frame = cap.read()
        if not success:
            print("Error: Failed to capture frame from RTSP stream.")
            break

        # Encode the frame in JPEG format
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            print("Error: Failed to encode frame.")
            break

        frame = buffer.tobytes()

        # Yield the frame in multipart format for the HTTP response
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()  # Release the video capture object


@app.route('/video_feed')
def video_feed():
    # Return the streaming response to the client
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(port=5001, debug=True)






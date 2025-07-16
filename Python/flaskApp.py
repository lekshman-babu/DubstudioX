from flask import Flask, request, jsonify, send_file
import processing as pr
import shutil
import os
app = Flask(__name__)

@app.route('/')
def home():
    return 'hello'
@app.route('/upload', methods=['POST'])
def upload_and_process_audio():
    raw_data = request.get_data()
    if not raw_data:
        return 'No audio file provided', 400

    path = 'Python\\uploadedAudio.mp3'

    with open(path, 'wb') as audio_file:
        audio_file.write(raw_data)

    print('Audio file uploaded successfully')
    try:
        shutil.rmtree('audio-chunks')
    except:
        pass
    
    path, source_text, target_text = pr.get_video_to_audio(path,request.headers['Target'])
    # Encode source_text and target_text as UT F-8
    source_text_encoded = source_text.encode('utf-8')
    target_text_encoded = target_text.encode('utf-8')

    # Create a Flask response containing both the audio file and JSON data
    response = send_file(
        path,
        as_attachment=True,
        mimetype='audio/mpeg',
    )

    # Set custom headers to include the JSON data in the response
    response.headers['sourceText'] = source_text_encoded
    response.headers['targetText'] = target_text_encoded

    return response

if __name__ == "__main__":
    app.run(debug=True,port=6000)

import speech_recognition as sr
import os
from pydub import AudioSegment
from pydub.silence import split_on_silence
from googletrans import Translator
from gtts import gTTS
import shutil


speechRecognizer = sr.Recognizer()

def mp3_to_wav_converter(path):
    input_file = path
    output_file = "result-en.wav"

    # convert mp3 file to wav file
    sound = AudioSegment.from_mp3(input_file)
    sound.export(output_file, format="wav")
    return output_file

def transcribe_audio(path):
   
    with sr.AudioFile(path) as source:
        audio_listened = speechRecognizer.record(source)
        text = speechRecognizer.recognize_google(audio_listened,language="en-us")
    return text


def get_large_audio_transcription_on_silence(path):

    sound = AudioSegment.from_file(path)
    chunks = split_on_silence(sound,
        min_silence_len = 500,
        silence_thresh = sound.dBFS-14,
        keep_silence=500,
    )
    folder_name = "Python\\audio-chunks"
    if not os.path.isdir(folder_name):
        os.mkdir(folder_name)
    whole_text = ""
    for i, audio_chunk in enumerate(chunks, start=1):
        chunk_filename = os.path.join(folder_name, f"chunk{i}.wav")
        audio_chunk.export(chunk_filename, format="wav")
        try:
            text = transcribe_audio(chunk_filename)
        except sr.UnknownValueError as e:
            # print("Error:", str(e))
            continue
        else:
            text = f"{text.capitalize()}. "
            # print(chunk_filename, ":", text)
            whole_text += text
    
    # return the text for all chunks detected
    shutil.rmtree(folder_name)

    return whole_text

def get_video_to_audio(path,targetLang):
    source=get_large_audio_transcription_on_silence(path)
    trans=Translator(service_urls=['translate.googleapis.com'])
    target=trans.translate(source,dest=targetLang)
    tts = gTTS(target.text,lang=targetLang)
    tts.save('Python\\processedFile.mp3')
    return 'processedFile.mp3',source,target.text

if __name__=="__main__":
    path=input("enter the path:")
    wav_path=mp3_to_wav_converter(path)
    fileName,souceText,targetText=get_video_to_audio(path)
    print(f"your file is uploaded in {fileName}")
    print(souceText)
    print(targetText)
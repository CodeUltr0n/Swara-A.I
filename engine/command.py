import pyttsx3
import speech_recognition as sr
import eel
import time

engine = pyttsx3.init()
engine.setProperty('voice', 'com.apple.voice.compact.en-AU.Karen')
engine.setProperty('rate', 174)


def speak(text):
    text = str(text)
    print(f"[TTS] {text}")
    engine.say(text)
    engine.runAndWait()
    time.sleep(1)
    # Removed eel display logic from speak


def takeCommand(): 

    r = sr.Recognizer()

    with sr.Microphone() as source:
        print('listening....')
        eel.DisplayMessage('listening....')
        r.pause_threshold = 1
        r.adjust_for_ambient_noise(source)
        time.sleep(0.5)
        audio = r.listen(source, 10, 6)

    try:
        print('recognizing')
        eel.DisplayMessage('recognizing....')
        query = r.recognize_google(audio, language='en-in')
        print(f"user said: {query}")
        eel.DisplayMessage(query)
        time.sleep(2)
       
    except Exception as e:
        return ""
    
    return query.lower()  # 👈 Return fallback flag





@eel.expose
def allCommand(message=1):
    try:
        if message == 1:
            query = takeCommand()
        else:
            query = message

        print(f"[USER]: {query}")
        speak(f"You said: {query}")
        eel.DisplayMessage(f"You said: {query}")

        if 'open' in query:
            from engine.features import openCommand
            openCommand(query)
        elif "on youtube" in query:
            from engine.features import playYoutube
            playYoutube(query)
        else:
            from engine.features import askChatBot
            response = askChatBot(query)
            print(f"[BOT]: {response}")
            speak(response)
            eel.DisplayBotMessage(response)

    except Exception as e:
        import traceback
        print("❌ error encountered:", e)
        traceback.print_exc()

   
    
  

    



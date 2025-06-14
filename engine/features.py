chat_session = {"chatbot": None, "conversation_id": None}
import eel
from playsound import playsound
import os

from engine.config import Assistant_name
from engine.command import *
import pywhatkit as kit
import re as re




# greetings from assistant
@eel.expose 
def playmic():
    music_path = "/Users/chokkaraketankumar/Desktop/SWARA-AI/SWARA/www/assets/texllate/audio/Aivoice-mic.mp3"
    if os.path.exists(music_path):
        playsound(music_path)
    else:
        print("⚠️ File not found:", music_path)

@eel.expose
def playAssistantSound():
    # Clean absolute path with no file:// prefix
    music_path = "/Users/chokkaraketankumar/Desktop/SWARA-AI/SWARA/www/assets/texllate/audio/AIVoice_Jenny.mp3"
    if os.path.exists(music_path):
        playsound(music_path)
    else:
        print("⚠️ File not found:", music_path)

import os
import platform
from engine.command import speak
from engine.config import Assistant_name
from hugchat import hugchat

# Predefined app/URL mappings
shortcuts = {
    "youtube": "https://www.youtube.com",
    "google": "https://www.google.com",
    "spotify": "https://open.spotify.com",
    "calculator": "calc" if platform.system() == "Windows" else "open -a Calculator",
    "notepad": "notepad" if platform.system() == "Windows" else "open -a TextEdit",
}

def openCommand(query):
    system_name = platform.system()
    print(f"[DEBUG] Platform: {system_name}")

    query = query.replace(Assistant_name.lower(), "")
    query = query.replace("open", "").strip().lower()

    if not query:
        speak("Not found")
        return

    # Check for shortcuts
    target = shortcuts.get(query)

    if target:
        speak(f"Opening {query}")
        # Run the appropriate command based on OS
        if "http" in target:
            if system_name == "Darwin":
                os.system(f"open {target}")
            elif system_name == "Windows":
                os.system(f"start {target}")
            else:
                os.system(f"xdg-open {target}")
        else:
            os.system(target)
    else:
        speak(f"Trying to open {query}")
        if system_name == "Darwin":
            os.system(f"open {query}")
        elif system_name == "Windows":
            os.system(f"start {query}")
        else:
            os.system(f"xdg-open {query}")

def playYoutube(query):
    search_term = extract_yt_term(query)
    speak("playing"+search_term+"on Youtube")
    kit.playonyt(search_term)


def extract_yt_term(command):
    pattern = r'play\s+(.*?)\s+on\s+youtube'
    match = re.search(pattern, command, re.IGNORECASE)
    
    if match:
        return match.group(1)
    else:
        return command  # fallback if pattern not matched
    
@eel.expose
def askChatBot(query):  # ✅ Persistent session enabled
    try:
        user_input = query.lower()
        global chat_session

        if chat_session["chatbot"] is None:
            chatbot = hugchat.ChatBot(cookie_path="engine/cookies.json")
            conversation_id = chatbot.new_conversation()
            chatbot.change_conversation(conversation_id)
            chat_session["chatbot"] = chatbot
            chat_session["conversation_id"] = conversation_id
        else:
            chatbot = chat_session["chatbot"]
            chatbot.change_conversation(chat_session["conversation_id"])

        response = chatbot.chat(user_input)
        eel.DisplayBotMessage(response) 
        print(response)
        return response
    except Exception as e:
        print("ChatBot error:", e)
        return "Sorry, something went wrong."

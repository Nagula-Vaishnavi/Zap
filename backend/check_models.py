import google.generativeai as genai
import os

genai.configure(api_key='AIzaSyDVG3OsOMh6SPkfndgaBSnYt5If1WF02n4')
print('Available models:')
for m in genai.list_models():
    print(m.name)

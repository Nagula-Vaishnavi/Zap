import google.generativeai as genai
import os

genai.configure(api_key='import.meta.env.VITE_API_KEY')
print('Available models:')
for m in genai.list_models():
    print(m.name)

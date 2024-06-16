from flask import Blueprint, request, jsonify
import openai
import os

bp = Blueprint('chatbot', __name__)

# Set OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')

    # Updated OpenAI API call for chat completion
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": user_message}
        ],
        max_tokens=150
    )
    
    return jsonify({'response': response['choices'][0]['message']['content'].strip()})
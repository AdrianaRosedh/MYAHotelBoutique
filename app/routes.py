from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
import openai

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    current_language = session.get('language', 'en')
    if current_language == 'es':
        return redirect(url_for('main.index_es'))
    return redirect(url_for('main.index_en'))

@bp.route('/en')
def index_en():
    session['language'] = 'en'
    email = "info@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    return render_template('index_en.html', email=email, phone=phone)

@bp.route('/es')
def index_es():
    session['language'] = 'es'
    email = "info@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    return render_template('index_es.html', email=email, phone=phone)

@bp.route('/set_language', methods=['POST'])
def set_language():
    selected_language = request.form.get('language')
    current_url = request.form.get('current_url')
    
    session['language'] = selected_language
    
    if selected_language == 'es':
        if not current_url.startswith('/es'):
            new_url = '/es' + current_url
        else:
            new_url = current_url
    else:
        if current_url.startswith('/es'):
            new_url = current_url.replace('/es', '', 1)
        else:
            new_url = current_url

    return redirect(new_url)

@bp.route('/oliveafarmtotable')
def oliveafarmtotable():
    current_language = session.get('language', 'en')
    email = "olivea@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    if current_language == 'es':
        return render_template('oliveafarmtotable_es.html', email=email, phone=phone)
    return render_template('oliveafarmtotable_en.html', email=email, phone=phone)

@bp.route('/es/oliveafarmtotable')
def oliveafarmtotable_es():
    email = "olivea@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    return render_template('oliveafarmtotable_es.html', email=email, phone=phone)

@bp.route('/divino')
def divino():
    current_language = session.get('language', 'en')
    email = "padel@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    if current_language == 'es':
        return render_template('divino_es.html', email=email, phone=phone)
    return render_template('divino_en.html', email=email, phone=phone)

@bp.route('/es/divino')
def divino_es():
    email = "padel@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    return render_template('divino_es.html', email=email, phone=phone)

@bp.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=user_message,
        max_tokens=150
    )
    return jsonify({'response': response.choices[0].text.strip()})

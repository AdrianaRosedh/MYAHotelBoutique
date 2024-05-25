from flask import Blueprint, render_template, request, redirect, url_for, session, send_from_directory
import os

bp = Blueprint('main', __name__)

def detect_language():
    # Detect language from Accept-Language header
    languages = request.headers.get('Accept-Language', '').split(',')
    for lang in languages:
        if lang.startswith('es'):
            return 'es'
    return 'en'

@bp.route('/')
def index():
    if 'language' not in session:
        session['language'] = detect_language()
    return redirect(url_for('main.index_localized', lang_code=session.get('language', 'en')))

@bp.route('/<lang_code>')
def index_localized(lang_code):
    session['language'] = lang_code
    email = "info@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    if lang_code == 'es':
        return render_template('index_es.html', email=email, phone=phone)
    return render_template('index_en.html', email=email, phone=phone)

@bp.route('/set_language', methods=['POST'])
def set_language():
    selected_language = request.form.get('language')
    current_url = request.form.get('current_url')

    session['language'] = selected_language

    if current_url.startswith('/es/'):
        current_url = current_url[3:]
    elif current_url.startswith('/en/'):
        current_url = current_url[3:]
    elif current_url in ['/es', '/en']:
        current_url = '/'

    new_url = f'/{selected_language}{current_url}' if current_url != '/' else f'/{selected_language}'

    return redirect(new_url)

@bp.route('/<lang_code>/oliveafarmtotable')
def oliveafarmtotable(lang_code):
    session['language'] = lang_code
    email = "olivea@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    if lang_code == 'es':
        return render_template('oliveafarmtotable_es.html', email=email, phone=phone)
    return render_template('oliveafarmtotable_en.html', email=email, phone=phone)

@bp.route('/<lang_code>/divino')
def divino(lang_code):
    session['language'] = lang_code
    email = "padel@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    if lang_code == 'es':
        return render_template('divino_es.html', email=email, phone=phone)
    return render_template('divino_en.html', email=email, phone=phone)

@bp.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(bp.root_path, 'static', 'img', 'favicons'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

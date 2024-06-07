from flask import Blueprint, render_template, request, redirect, session, url_for, send_from_directory, flash
from datetime import datetime, timedelta
import os


bp = Blueprint('main', __name__)

def detect_language():
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

@bp.route('/<lang_code>/reservation', methods=['GET', 'POST'])
def reservation(lang_code):
    session['language'] = lang_code
    today = datetime.today().strftime('%Y-%m-%d')
    tomorrow = (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d')

    if request.method == 'POST':
        checkin_date = request.form.get('checkin', today)
        checkout_date = request.form.get('checkout', tomorrow)

        print(f"Received POST request with check-in date: {checkin_date} and check-out date: {checkout_date}")

        try:
            url = f"https://hotels.cloudbeds.com/{lang_code}/reservation/pkwNrX?checkin={checkin_date}&checkout={checkout_date}"
            print(f"Constructed redirect URL: {url}")
            return redirect(url)
        except Exception as e:
            print(f"Error during redirection: {e}")
            flash('An error occurred while processing your reservation. Please try again.')
            return render_template(f'reservation_{lang_code}.html', today=today, tomorrow=tomorrow, lang_code=lang_code)

    print("Handling GET request")
    return render_template(f'reservation_{lang_code}.html', today=today, tomorrow=tomorrow, lang_code=lang_code)

@bp.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(bp.root_path, 'static', 'img', 'favicons'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

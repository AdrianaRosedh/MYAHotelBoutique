from flask import Blueprint, render_template, request, redirect, url_for, session

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
    
    # Remove the leading language part from the URL
    if current_url.startswith('/es'):
        current_url = current_url[3:]
    elif current_url.startswith('/en'):
        current_url = current_url[3:]
    
    # Prepend the new language to the URL
    if selected_language == 'es':
        new_url = f'/es{current_url}'
    else:
        new_url = f'/en{current_url}'

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

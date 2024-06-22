from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    session,
    url_for,
    send_from_directory,
    flash,
)
from datetime import datetime, timedelta
import os
from flask_sitemap import Sitemap

bp = Blueprint("main", __name__)
sitemap = Sitemap()

def detect_language():
    languages = request.headers.get("Accept-Language", "").split(",")
    for lang in languages:
        if lang.startswith("es"):
            return "es"
    return "en"

@bp.route("/")
def index():
    if "language" not in session:
        session["language"] = detect_language()
    return redirect(
        url_for("main.index_localized", lang_code=session.get("language", "en"))
    )

@bp.route("/<lang_code>")
def index_localized(lang_code):
    session["language"] = lang_code
    email = "info@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    canonical_url = url_for('main.index_localized', lang_code=lang_code, _external=True)
    if lang_code == "es":
        return render_template("index_es.html", page_name='MYA', email=email, phone=phone, lang_code=lang_code, canonical_url=canonical_url)
    return render_template("index_en.html", page_name='MYA', email=email, phone=phone, lang_code=lang_code, canonical_url=canonical_url)

@bp.route("/set_language", methods=["POST"])
def set_language():
    selected_language = request.form.get("language")
    current_url = request.form.get("current_url")

    session["language"] = selected_language

    if current_url.startswith("/es/"):
        current_url = current_url[3:]
    elif current_url.startswith("/en/"):
        current_url = current_url[3:]
    elif current_url in ["/es", "/en"]:
        current_url = "/"

    new_url = (
        f"/{selected_language}{current_url}"
        if current_url != "/"
        else f"/{selected_language}"
    )

    return redirect(new_url)

@bp.route("/<lang_code>/oliveafarmtotable")
def oliveafarmtotable(lang_code):
    session["language"] = lang_code
    email = "olivea@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    canonical_url = url_for('main.oliveafarmtotable', lang_code=lang_code, _external=True)
    if lang_code == "es":
        return render_template("oliveafarmtotable_es.html", page_name='Olivea', email=email, phone=phone, lang_code=lang_code, canonical_url=canonical_url)
    return render_template("oliveafarmtotable_en.html", page_name='Olivea', email=email, phone=phone, lang_code=lang_code, canonical_url=canonical_url)

@bp.route("/<lang_code>/divino")
def divino(lang_code):
    session["language"] = lang_code
    email = "padel@myahotelboutique.com"
    phone = "+52 (646) 388-2369"
    canonical_url = url_for('main.divino', lang_code=lang_code, _external=True)
    if lang_code == "es":
        return render_template("divino_es.html", page_name='Divino', email=email, phone=phone, lang_code=lang_code, canonical_url=canonical_url)
    return render_template("divino_en.html", page_name='Divino', email=email, phone=phone, lang_code=lang_code, canonical_url=canonical_url)

@bp.route("/<lang_code>/reservation", methods=["GET", "POST"])
def reservation(lang_code):
    session["language"] = lang_code
    today = datetime.today().strftime("%Y-%m-%d")
    tomorrow = (datetime.today() + timedelta(days=1)).strftime("%Y-%m-%d")
    canonical_url = url_for('main.reservation', lang_code=lang_code, _external=True)

    if request.method == "POST":
        checkin_date = request.form.get("checkin", today)
        checkout_date = request.form.get("checkout", tomorrow)

        print(
            f"Received POST request with check-in date: {checkin_date} and check-out date: {checkout_date}"
        )

        try:
            url = f"https://hotels.cloudbeds.com/{lang_code}/reservation/pkwNrX?checkin={checkin_date}&checkout={checkout_date}"
            print(f"Constructed redirect URL: {url}")
            return redirect(url)
        except Exception as e:
            print(f"Error during redirection: {e}")
            flash(
                "An error occurred while processing your reservation. Please try again."
            )
            return render_template(
                f"reservation_{lang_code}.html",
                today=today,
                tomorrow=tomorrow,
                lang_code=lang_code,
                canonical_url=canonical_url,
            )

    print("Handling GET request")
    return render_template(
        f"reservation_{lang_code}.html",
        today=today,
        tomorrow=tomorrow,
        lang_code=lang_code,
        canonical_url=canonical_url,
    )

@bp.route("/<lang_code>/opentable_reservation", methods=["GET", "POST"])
def opentable_reservation(lang_code):
    session["language"] = lang_code
    today = datetime.today().strftime("%Y-%m-%d")
    default_time = "19:00"
    canonical_url = url_for('main.opentable_reservation', lang_code=lang_code, _external=True)

    if request.method == "POST":
        reservation_date = request.form.get("reservation_date", today)
        time = request.form.get("time", default_time)
        party_size = request.form.get("party_size", "2")

        print(
            f"Received POST request with reservation date: {reservation_date}, time: {time}, and party size: {party_size}"
        )

        try:
            url = f"https://www.opentable.com.mx/restref/client/?rid=1313743&restref=1313743&lang={lang_code}&color=8&r3uid=cfe&dark=false&partysize={party_size}&datetime={reservation_date}T{time}&ot_source=Restaurant%20website&logo_pid=0&background_pid=0&font=arialBlack&ot_logo=standard&primary_color=ffffff&primary_font_color=333333&button_color=da3743&button_font_color=ffffff&corrid=ea21e764-72c0-4b7c-bbd4-1f25a194b7b4"
            print(f"Constructed redirect URL: {url}")
            return redirect(url)
        except Exception as e:
            print(f"Error during redirection: {e}")
            flash(
                "An error occurred while processing your reservation. Please try again."
            )
            return render_template(
                f"reservation_{lang_code}.html",
                today=today,
                default_time=default_time,
                lang_code=lang_code,
                canonical_url=canonical_url,
            )

    print("Handling GET request")
    return render_template(
        f"reservation_{lang_code}.html",
        today=today,
        default_time=default_time,
        lang_code=lang_code,
        canonical_url=canonical_url,
    )

@bp.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(bp.root_path, "static", "dist", "img", "favicons"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon",
    )

@bp.route('/robots.txt')
def robots_txt():
    return send_from_directory(bp.root_path, 'static', 'robots.txt')

# Error handler for 404 errors
@bp.app_errorhandler(404)
def page_not_found(e):
    return render_template('custom_404.html'), 404

# Register routes with the sitemap
@sitemap.register_generator
def index():
    yield 'main.index', {}

@sitemap.register_generator
def index_localized():
    languages = ['en', 'es']
    for lang in languages:
        yield 'main.index_localized', {'lang_code': lang}

@sitemap.register_generator
def oliveafarmtotable():
    languages = ['en', 'es']
    for lang in languages:
        yield 'main.oliveafarmtotable', {'lang_code': lang}

@sitemap.register_generator
def divino():
    languages = ['en', 'es']
    for lang in languages:
        yield 'main.divino', {'lang_code': lang}

# /app/__init__.py

from flask import Flask, request, session, render_template
from flask_babel import Babel
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask_sitemap import Sitemap
from flask_compress import Compress
from flask_caching import Cache

load_dotenv()  # Load environment variables from .env file

def get_locale():
    # Detect language from session or Accept-Language header
    return session.get("language", request.accept_languages.best_match(["en", "es"]))

def get_timezone():
    return "UTC"

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config["BABEL_DEFAULT_LOCALE"] = "en"
    app.config["BABEL_DEFAULT_TIMEZONE"] = "UTC"
    app.secret_key = "your_secret_key"

    # Enable compression
    Compress(app)

    # Configure caching
    cache = Cache(app, config={'CACHE_TYPE': 'simple'})
    cache.init_app(app)

    # Initialize Babel with the locale and timezone selector functions
    babel = Babel(app, locale_selector=get_locale, timezone_selector=get_timezone)

    # Initialize Flask-Sitemap
    sitemap = Sitemap(app)

    # Register Blueprints
    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    from .chatbot_routes import bp as chatbot_bp
    app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

    # Set default language in session if not set
    @app.before_request
    def set_default_language():
        if "language" not in session:
            session["language"] = request.accept_languages.best_match(
                ["en", "es"], default="en"
            )

    # Define context processor to inject `locale` into templates
    @app.context_processor
    def inject_locale():
        return {"locale": get_locale()}

    # Define context processor to inject `today` and `tomorrow` into templates
    @app.context_processor
    def inject_dates():
        today = datetime.today().strftime("%Y-%m-%d")
        tomorrow = (datetime.today() + timedelta(days=1)).strftime("%Y-%m-%d")
        return {"today": today, "tomorrow": tomorrow}

    # Custom error handler for 404
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("custom_404.html"), 404

    # Add cache headers for static files
    @app.after_request
    def add_cache_headers(response):
        if 'maps.googleapis.com' in request.url:
            response.headers['Cache-Control'] = 'public, max-age=86400'  # 1 day
        elif 'cdn.jsdelivr.net' in request.url:
            response.headers['Cache-Control'] = 'public, max-age=604800'  # 7 days
        elif 'hammerjs.github.io' in request.url:
            response.headers['Cache-Control'] = 'public, max-age=86400'  # 1 day
        return response

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

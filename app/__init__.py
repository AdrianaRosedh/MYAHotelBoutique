# /app/__init__.py

from flask import Flask, request, session
from flask_babel import Babel

def get_locale():
    return session.get('language', request.accept_languages.best_match(['en', 'es']))

def get_timezone():
    return 'UTC'

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['BABEL_DEFAULT_LOCALE'] = 'en'
    app.config['BABEL_DEFAULT_TIMEZONE'] = 'UTC'
    app.secret_key = 'your_secret_key'

    # Initialize Babel with the locale and timezone selector functions
    babel = Babel(app, locale_selector=get_locale, timezone_selector=get_timezone)

    # Register Blueprints
    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    # Define context processor to inject `locale` into templates
    @app.context_processor
    def inject_locale():
        return {'locale': get_locale()}

    return app

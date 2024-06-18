# MYA Hotel Boutique

Welcome to the MYA Hotel Boutique project repository. This project is a comprehensive website for a boutique hotel, restaurant, cafe, and Padel courts.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Gulp Tasks](#gulp-tasks)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Description

MYA Hotel Boutique offers an exceptional online experience for potential guests, providing detailed information about the hotel's offerings, rooms, restaurant, cafe, Padel courts, and services, along with an easy-to-use booking system.

## Features

- **Home Page:** Overview of the hotel with a beautiful layout.
- **Room Details:** Information about different rooms and booking options.
- **Booking System:** Allows users to book rooms directly from the website.
- **Restaurant and Cafe:** Menus, booking options, and event information.
- **Padel Courts:** Booking system for courts.
- **Contact Form:** A form for users to get in touch with the hotel.
- **Responsive Design:** Ensures the website looks great on all devices.

## Screenshots

- Home Page
- Booking Page
- Restaurant Page
- Padel Courts Page

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (Flask framework)
- **Database:** SQLAlchemy
- **Deployment:** Gunicorn

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/AdrianaRosedh/MYAHotelBoutique.git
    cd MYAHotelBoutique
    ```

2. Set up a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Install Node.js and npm (if not already installed):
    ```bash
    # For Debian/Ubuntu
    sudo apt update
    sudo apt install nodejs npm

    # For macOS using Homebrew
    brew install node
    ```

5. Install Gulp CLI globally:
    ```bash
    npm install -g gulp-cli@2.3.0
    ```

6. Install project-specific dependencies:
    ```bash
    npm install
    ```

7. Run the application:
    ```bash
    python run.py
    ```

## Usage

- Access the website at `http://localhost:5000`
- Navigate through different sections: Home, Rooms, Restaurant, Cafe, Padel Courts, Contact.

## Gulp Tasks

### Installation

1. **Install Node.js and npm**:

   Ensure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

2. **Install Gulp CLI**:
   ```bash
   npm install -g gulp-cli@2.3.0

3. **Install Project Dependencies**:
    Navigate to the project directory and run:
    npm install

## Usage

    Build

    To clean and build the project, run:
    
## Gulp Tasks Overview

- clean: Deletes the dist directory.
- customStyles: Processes custom CSS files, applies PostCSS plugins, and outputs minified files.
- vendorStyles: Processes vendor CSS files similarly to custom styles.
- scripts: Concatenates and minifies JavaScript files.
- chatbotAndFeaturesScripts: Concatenates and minifies chatbot and feature-specific JavaScript files.
- images: Optimizes and copies image files.
-  fonts: Copies font files to the dist directory.

## Adding New Tasks

To add new tasks, edit the gulpfile.mjs and define your tasks similarly to the existing ones.

## Troubleshooting

    Gulp Errors: Ensure that you are using compatible versions of Gulp and its plugins.
    Image Issues: Verify paths and permissions if images are not showing up correctly.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Author:** Adriana Rosedh
- **Email:** [adriana@dhconstruccion.com](mailto:adriana@dhconstruccion.com)

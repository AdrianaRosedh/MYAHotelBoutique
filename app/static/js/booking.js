// Get elements for Hotel Booking Engine
const bookNowButton = document.getElementById('bookNowButton');
const bookingModal = document.getElementById('bookingModal');
const closeModalButton = document.getElementById('closeModalButton');
const bookingForm = document.getElementById('bookingForm');

// Show modal when "Book Now" button is clicked
bookNowButton.addEventListener('click', () => {
    bookingModal.classList.remove('hidden');
    requestAnimationFrame(() => {
        bookingModal.firstElementChild.classList.add('modal-enter-active');
    });
});

// Hide modal when close button is clicked
closeModalButton.addEventListener('click', () => {
    bookingModal.firstElementChild.classList.remove('modal-enter-active');
    bookingModal.firstElementChild.classList.add('modal-leave-active');
    bookingModal.firstElementChild.addEventListener('transitionend', () => {
        bookingModal.classList.add('hidden');
        bookingModal.firstElementChild.classList.remove('modal-leave-active');
        bookingModal.firstElementChild.classList.add('modal-enter');
    }, { once: true });
});

// Hide modal when clicking outside the modal content
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        bookingModal.firstElementChild.classList.remove('modal-enter-active');
        bookingModal.firstElementChild.classList.add('modal-leave-active');
        bookingModal.firstElementChild.addEventListener('transitionend', () => {
            bookingModal.classList.add('hidden');
            bookingModal.firstElementChild.classList.remove('modal-leave-active');
            bookingModal.firstElementChild.classList.add('modal-enter');
        }, { once: true });
    }
});

// Form validation and submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    // First Name validation
    const firstName = document.getElementById('first_name');
    const firstNameError = document.getElementById('firstNameError');
    if (!firstName.value.trim()) {
        firstNameError.classList.remove('hidden');
        valid = false;
    } else {
        firstNameError.classList.add('hidden');
    }

    // Last Name validation
    const lastName = document.getElementById('last_name');
    const lastNameError = document.getElementById('lastNameError');
    if (!lastName.value.trim()) {
        lastNameError.classList.remove('hidden');
        valid = false;
    } else {
        lastNameError.classList.add('hidden');
    }

    // Email validation
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value)) {
        emailError.classList.remove('hidden');
        valid = false;
    } else {
        emailError.classList.add('hidden');
    }

    // Check-in Date validation
    const checkin = document.getElementById('checkin');
    const checkinError = document.getElementById('checkinError');
    if (!checkin.value.trim()) {
        checkinError.classList.remove('hidden');
        valid = false;
    } else {
        checkinError.classList.add('hidden');
    }

    // Check-out Date validation
    const checkout = document.getElementById('checkout');
    const checkoutError = document.getElementById('checkoutError');
    if (!checkout.value.trim()) {
        checkoutError.classList.remove('hidden');
        valid = false;
    } else {
        checkoutError.classList.add('hidden');
    }

    // Number of Guests validation
    const guests = document.getElementById('guests');
    const guestsError = document.getElementById('guestsError');
    if (!guests.value.trim() || parseInt(guests.value) < 1) {
        guestsError.classList.remove('hidden');
        valid = false;
    } else {
        guestsError.classList.add('hidden');
    }

    if (valid) {
        const formData = new FormData(bookingForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        try {
            const response = await fetch(bookingForm.action, {
                method: bookingForm.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Network response was not ok: ${response.statusText}. Error details: ${errorData.error}`);
                throw new Error(`Network response was not ok: ${response.statusText}. Error details: ${errorData.error}`);
            }

            const data = await response.json();

            if (data.success) {
                alert('Booking Successful!');
            } else {
                alert('Error making reservation.');
            }

            bookingModal.firstElementChild.classList.remove('modal-enter-active');
            bookingModal.firstElementChild.classList.add('modal-leave-active');
            bookingModal.firstElementChild.addEventListener('transitionend', () => {
                bookingModal.classList.add('hidden');
                bookingModal.firstElementChild.classList.remove('modal-leave-active');
                bookingModal.firstElementChild.classList.add('modal-enter');
            }, { once: true });
            bookingForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert(`Error making reservation: ${error.message}`);
        }
    }
});

// Ensure the language form submits correctly via JavaScript
document.querySelector('.language-form select').addEventListener('change', function() {
    this.form.submit();
});

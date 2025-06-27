document.addEventListener('DOMContentLoaded', function () {

    // --- Configuration ---
    // IMPORTANT: Replace this placeholder with the actual URL from your Google Apps Script deployment.
    const SCRIPT_URL = "YOUR_APPS_SCRIPT_DEPLOYMENT_URL_HERE";

    // --- Element Selections ---
    const form1 = document.getElementById('lead-form');
    const emailInput1 = document.getElementById('email');
    const submitButton1 = document.getElementById('submit-button');
    const formMessage1 = document.getElementById('form-message');

    const form2 = document.getElementById('lead-form-2');
    const emailInput2 = document.getElementById('email-2');
    const submitButton2 = document.getElementById('submit-button-2');
    const formMessage2 = document.getElementById('form-message-2');

    /**
     * Handles the form submission process for a given form.
     * @param {Event} e - The form submission event.
     * @param {HTMLFormElement} form - The form element being submitted.
     * @param {HTMLInputElement} emailInput - The email input field.
     * @param {HTMLButtonElement} submitButton - The submit button.
     * @param {HTMLElement} formMessage - The element to display messages.
     */
    const handleFormSubmit = (e, form, emailInput, submitButton, formMessage) => {
        e.preventDefault(); // Prevent default form submission

        const email = emailInput.value.trim();

        // --- Client-side validation ---
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'error', formMessage);
            return;
        }

        // --- Set loading state ---
        showMessage('Submitting...', 'loading', formMessage);
        submitButton.disabled = true;
        submitButton.style.cursor = 'wait';

        // --- Prepare data for submission ---
        const formData = new FormData(form);
        
        // --- Fetch API to send data to Google Apps Script ---
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                showMessage('Thank you for joining!', 'success', formMessage);
                // Hide the form on success
                form.querySelector('.form-container').style.display = 'none';
            } else {
                // This handles errors returned from the Apps Script itself
                throw new Error(data.error || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Something went wrong. Please try again.', 'error', formMessage);
            // Re-enable the form on error
            submitButton.disabled = false;
            submitButton.style.cursor = 'pointer';
        });
    };

    /**
     * Validates an email address format.
     * @param {string} email - The email address to validate.
     * @returns {boolean} - True if the email is valid, false otherwise.
     */
    const validateEmail = (email) => {
        if (!email) return false;
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    /**
     * Displays a message to the user in the specified message element.
     * @param {string} message - The message text to display.
     * @param {string} type - The type of message ('success', 'error', 'loading').
     * @param {HTMLElement} messageElement - The HTML element where the message will be shown.
     */
    const showMessage = (message, type, messageElement) => {
        messageElement.textContent = message;
        messageElement.className = ''; // Clear previous classes
        messageElement.classList.add(type);
    };

    // --- Attach Event Listeners ---
    if (form1) {
        form1.addEventListener('submit', (e) => handleFormSubmit(e, form1, emailInput1, submitButton1, formMessage1));
    }
    if (form2) {
        form2.addEventListener('submit', (e) => handleFormSubmit(e, form2, emailInput2, submitButton2, formMessage2));
    }
});

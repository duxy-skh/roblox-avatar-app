document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const fetchButton = document.getElementById('fetch-button');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const inputSection = document.getElementById('input-section');
    const loadingSection = document.getElementById('loading-section');
    const avatarSection = document.getElementById('avatar-section');
    const avatarContainer = document.getElementById('avatar-container');
    const avatarUsername = document.getElementById('avatar-username');
    const verificationSection = document.getElementById('verification-section');
    const errorMessage = document.getElementById('error-message');
    const successContent = document.getElementById('success-content');
    const selectionSection = document.getElementById('selection-section');
    let selectedRobux = null;

    // Fetch avatar when button is clicked
    fetchButton.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();

        if (!username) {
            alert('Please enter a username.');
            return;
        }

        // Show loading section, hide input section
        inputSection.style.display = 'none';
        loadingSection.style.display = 'block';

        // Simulate API call (3 seconds for demo purposes)
        setTimeout(() => {
            fetch('/api/avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Hide loading section
                    loadingSection.style.display = 'none';

                    // Handle success or error
                    if (data.error) {
                        // Display error message
                        errorMessage.style.display = 'block';
                        successContent.style.display = 'none';
                        avatarSection.style.display = 'block'; // Show avatar section for retry
                    } else {
                        // Display avatar and Robux selection
                        errorMessage.style.display = 'none';
                        successContent.style.display = 'block';
                        avatarSection.style.display = 'block';
                        avatarUsername.textContent = data.username;
                        avatarContainer.innerHTML = `
                            <img src="${data.avatar_url}" alt="Roblox Avatar" style="width:150px; height:150px; border-radius:50%;">
                        `;
                        localStorage.setItem('username', data.username);
                    }
                })
                .catch((error) => {
                    console.error('Fetch error:', error);

                    // Hide loading section and show error message
                    loadingSection.style.display = 'none';
                    errorMessage.style.display = 'block';
                    successContent.style.display = 'none';
                    avatarSection.style.display = 'block';
                });
        }, 3000);
    });

    // Handle Robux selection
    document.querySelectorAll('.robux-button').forEach((button) => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            document
                .querySelectorAll('.robux-button')
                .forEach((btn) => btn.classList.remove('active'));

            // Add active class to the clicked button
            this.classList.add('active');
            selectedRobux = this.getAttribute('data-amount');
            localStorage.setItem('selectedRobux', selectedRobux); // Save selection
        });
    });

    // Handle Next Button
    nextButton.addEventListener('click', () => {
        if (!selectedRobux) {
            alert('Please select a Robux amount!');
            return;
        }

        // Show verification section
        avatarSection.style.display = 'none';
        verificationSection.style.display = 'block';

        // Populate verification details
        document.getElementById('verification-username').textContent = localStorage.getItem('username');
        document.getElementById('verification-robux').textContent = localStorage.getItem('selectedRobux');
    });

    // Handle Back Button
    backButton.addEventListener('click', () => {
        // Reset to input section
        avatarSection.style.display = 'none';
        inputSection.style.display = 'block';
        errorMessage.style.display = 'none'; // Hide error message
        successContent.style.display = 'none'; // Hide success content
    });
});

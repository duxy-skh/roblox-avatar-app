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
    let selectedRobux = null;

    // Handle Fetch Button Click
    fetchButton.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();

        if (!username) {
            alert('Please enter a username.');
            return;
        }

        // Show loading section, hide input section
        inputSection.style.display = 'none';
        loadingSection.style.display = 'block';

        // Simulate API call
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

                    if (data.error) {
                        // Handle user not found
                        avatarContainer.innerHTML = `<p class="error">${data.error}</p>`;
                        errorMessage.style.display = 'block'; // Show error message
                        successContent.style.display = 'none'; // Hide success content
                        avatarSection.style.display = 'block'; // Show avatar section
                        nextButton.style.display = 'none'; // Hide Next button
                    } else {
                        // Display avatar and success content
                        avatarContainer.innerHTML = `
                            <img src="${data.avatar_url}" alt="Roblox Avatar" style="width:150px; height:150px; border-radius:50%;">
                        `;
                        avatarUsername.textContent = data.username;
                        errorMessage.style.display = 'none'; // Hide error message
                        successContent.style.display = 'block'; // Show success content
                        avatarSection.style.display = 'block'; // Show avatar section
                        nextButton.style.display = 'inline-block'; // Show Next button
                        localStorage.setItem('username', data.username); // Save username
                    }
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    loadingSection.style.display = 'none';

                    // Show unexpected error
                    avatarContainer.innerHTML = '<p class="error">An unexpected error occurred. Please try again.</p>';
                    errorMessage.style.display = 'block'; // Show error message
                    successContent.style.display = 'none'; // Hide success content
                    avatarSection.style.display = 'block'; // Show avatar section
                    nextButton.style.display = 'none'; // Hide Next button
                });
        }, 3000); // Simulated delay for loading
    });

    // Handle Robux Selection
    document.querySelectorAll('.robux-button').forEach((button) => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            document
                .querySelectorAll('.robux-button')
                .forEach((btn) => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');
            selectedRobux = this.getAttribute('data-amount');
            localStorage.setItem('selectedRobux', selectedRobux); // Save selected Robux
        });
    });

  // Handle Next Button
nextButton.addEventListener('click', function () {
    if (selectedRobux) {
        // Show the Robux loading section
        avatarSection.style.display = 'none';
        document.getElementById('robux-loading-section').style.display = 'block';

        // Simulate loading for 3 seconds
        setTimeout(() => {
            // Hide the Robux loading section
            document.getElementById('robux-loading-section').style.display = 'none';

            // Show verification section
            verificationSection.style.display = 'block';

            // Populate verification details
            document.getElementById('verification-username').textContent =
                localStorage.getItem('username');
            document.getElementById('verification-robux').textContent =
                localStorage.getItem('selectedRobux');
            document
                .getElementById('verification-avatar')
                .setAttribute('src', avatarContainer.querySelector('img').getAttribute('src'));
        }, 3000); // 3-second loading simulation
    } else {
        alert('Please select a Robux amount!');
    }
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

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');

    burgerMenu.addEventListener('click', () => {
        // Toggle the active class on the burger menu and nav menu
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
});


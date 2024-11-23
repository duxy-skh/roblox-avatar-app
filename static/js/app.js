document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-button');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const inputSection = document.getElementById('input-section');
    const loadingSection = document.getElementById('loading-section');
    const avatarSection = document.getElementById('avatar-section');
    const avatarContainer = document.getElementById('avatar-container');
    const avatarUsername = document.getElementById('avatar-username');
    const verificationSection = document.getElementById('verification-section');
    let selectedRobux = null;

    // Fetch avatar when button is clicked
    fetchButton.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();

        if (!username) {
            alert('Please enter a username.');
            return;
        }

        // Show loading section and hide input section
        inputSection.style.display = 'none';
        loadingSection.style.display = 'block';

        // Simulate loading for 3 seconds
        setTimeout(() => {
            // Call the Flask API to fetch the avatar
            fetch('/api/avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('API Response:', data);

                    // Hide loading section
                    loadingSection.style.display = 'none';

                    // Handle success or error
                    if (data.error) {
                        avatarContainer.innerHTML = `<p class="error">${data.error}</p>`;
                        avatarSection.style.display = 'block'; // Show avatar section with error
                        nextButton.style.display = 'none';
                        backButton.style.display = 'block';
                    } else {
                        avatarContainer.innerHTML = `
                            <img src="${data.avatar_url}" alt="Roblox Avatar" style="width:150px; height:150px; border-radius:50%;">
                        `;
                        avatarUsername.textContent = data.username;
                        avatarSection.style.display = 'block'; // Show avatar section
                        nextButton.style.display = 'inline-block';
                        backButton.style.display = 'none';
                        localStorage.setItem('username', data.username);
                    }
                })
                .catch((error) => {
                    console.error('Fetch error:', error);

                    // Hide loading section
                    loadingSection.style.display = 'none';

                    // Show error message
                    avatarContainer.innerHTML = '<p class="error">An unexpected error occurred. Please try again.</p>';
                    avatarSection.style.display = 'block'; // Show avatar section
                    nextButton.style.display = 'none';
                    backButton.style.display = 'block';
                });
        }, 3000); // 3-second loading simulation
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
            localStorage.setItem('selectedRobux', selectedRobux); // Save selected Robux
        });
    });

    // Handle Next Button
    nextButton.addEventListener('click', function () {
        if (selectedRobux) {
            // Show verification section
            avatarSection.style.display = 'none';
            verificationSection.style.display = 'block';

            // Populate verification details
            document.getElementById('verification-username').textContent =
                localStorage.getItem('username');
            document.getElementById('verification-robux').textContent =
                localStorage.getItem('selectedRobux');
        } else {
            alert('Please select a Robux amount!');
        }
    });

    // Handle Back Button
    backButton.addEventListener('click', () => {
        avatarSection.style.display = 'none'; // Hide avatar section
        inputSection.style.display = 'block'; // Show input section
    });
});

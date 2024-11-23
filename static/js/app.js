document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-button');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const inputSection = document.getElementById('input-section');
    const loadingSection = document.getElementById('loading-section');
    const avatarSection = document.getElementById('avatar-section');
    const errorMessage = document.getElementById('error-message');
    const successContent = document.getElementById('success-content');
    const avatarContainer = document.getElementById('avatar-container');
    const avatarUsername = document.getElementById('avatar-username');
    const verificationSection = document.getElementById('verification-section');
    let selectedRobux = null;

    // Handle fetching avatar
    fetchButton.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();

        if (!username) {
            alert('Please enter a username!');
            return;
        }

        // Hide input section, show loading
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
                    loadingSection.style.display = 'none';

                    if (data.error) {
                        // Show error message
                        errorMessage.style.display = 'block';
                        successContent.style.display = 'none';
                    } else {
                        // Display success content
                        errorMessage.style.display = 'none';
                        successContent.style.display = 'block';
                        avatarUsername.textContent = data.username;
                        avatarContainer.innerHTML = `
                            <img src="${data.avatar_url}" alt="Roblox Avatar" style="width:150px; height:150px; border-radius:50%;">
                        `;
                    }
                })
                .catch((error) => {
                    console.error('API Error:', error);
                    loadingSection.style.display = 'none';
                    errorMessage.style.display = 'block';
                    successContent.style.display = 'none';
                });
        }, 3000);
    });

    // Handle Robux selection
    document.querySelectorAll('.robux-button').forEach((button) => {
        button.addEventListener('click', () => {
            document
                .querySelectorAll('.robux-button')
                .forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            selectedRobux = button.getAttribute('data-amount');
        });
    });

    // Handle Next Button
    nextButton.addEventListener('click', () => {
        if (!selectedRobux) {
            alert('Please select a Robux amount!');
            return;
        }

        avatarSection.style.display = 'none';
        verificationSection.style.display = 'block';
        document.getElementById('verification-username').textContent = avatarUsername.textContent;
        document.getElementById('verification-robux').textContent = selectedRobux;
    });

    // Handle Back Button
    backButton.addEventListener('click', () => {
        errorMessage.style.display = 'none';
        successContent.style.display = 'none';
        avatarSection.style.display = 'none';
        inputSection.style.display = 'block';
    });
});

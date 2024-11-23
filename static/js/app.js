document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-button');
    const backButton = document.getElementById('back-button');
    const inputSection = document.getElementById('input-section');
    const loadingSection = document.getElementById('loading-section');
    const avatarSection = document.getElementById('avatar-section');
    const avatarContainer = document.getElementById('avatar-container');
    const avatarUsername = document.getElementById('avatar-username');

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
                    } else {
                        avatarContainer.innerHTML = `
                            <img src="${data.avatar_url}" alt="Roblox Avatar" style="width:150px; height:150px; border-radius:50%;">
                        `;
                        avatarUsername.textContent = data.username;
                    }

                    // Show avatar section
                    avatarSection.style.display = 'block';
                })
                .catch((error) => {
                    console.error('Fetch error:', error);

                    // Hide loading section
                    loadingSection.style.display = 'none';

                    // Show error message
                    avatarContainer.innerHTML = '<p class="error">An unexpected error occurred. Please try again.</p>';
                    avatarSection.style.display = 'block';
                });
        }, 3000); // 3-second loading simulation
    });

    // Go back to input section
    backButton.addEventListener('click', () => {
        avatarSection.style.display = 'none'; // Hide avatar section
        inputSection.style.display = 'block'; // Show input section
    });
});

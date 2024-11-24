document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-button');
    const backButton = document.getElementById('back-button');
    const inputSection = document.getElementById('input-section');
    const loadingSection = document.getElementById('loading-section');
    const avatarSection = document.getElementById('avatar-section');
    const avatarContainer = document.getElementById('avatar-container');
    const avatarUsername = document.getElementById('avatar-username');

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
            // Fetch avatar data from the Flask API
            fetch('/api/avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
                .then((response) => response.json())
                .then((data) => {
                    loadingSection.style.display = 'none'; // Hide loading section

                    if (data.error) {
                        avatarContainer.innerHTML = `<p>${data.error}</p>`;
                    } else {
                        avatarContainer.innerHTML = `
                            <img src="${data.avatar_url}" alt="Roblox Avatar" style="width:150px; height:150px; border-radius:50%;">
                        `;
                        avatarUsername.textContent = data.username;
                    }

                    avatarSection.style.display = 'block'; // Show avatar section
                })
                .catch((error) => {
                    console.error('Error:', error);
                    loadingSection.style.display = 'none';
                    avatarContainer.innerHTML = '<p>An unexpected error occurred.</p>';
                    avatarSection.style.display = 'block';
                });
        }, 3000);
    });

    backButton.addEventListener('click', () => {
        avatarSection.style.display = 'none'; // Hide avatar section
        inputSection.style.display = 'block'; // Show input section
    });
});

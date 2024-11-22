from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get the username from the form, stripping any extra spaces
        username = request.form.get('username').strip()
        if username:
            return redirect(url_for('avatar', username=username))
    return render_template('index.html')

@app.route('/avatar/<username>')
def avatar(username):
    try:
        # New Roblox API to get user info
        api_url = "https://users.roblox.com/v1/usernames/users"
        payload = {"usernames": [username]}  # API expects a list of usernames

        # Send POST request to fetch user details
        response = requests.post(api_url, json=payload)

        # Log the API response for debugging
        print(f"Usernames API Response for {username}: {response.text}")

        # Check if the API call was successful
        if response.status_code != 200:
            return render_template('avatar.html', username=username, avatar_url=None)

        data = response.json()

        # Check if user data exists
        if "data" in data and data["data"]:
            user_id = data["data"][0]["id"]  # Extract user ID

            # Fetch avatar URL from Roblox's Thumbnails API
            avatar_api_url = f"https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds={user_id}&size=420x420&format=Png&isCircular=false"
            avatar_response = requests.get(avatar_api_url)

            # Log the avatar API response for debugging
            print(f"Thumbnails API Response for userId {user_id}: {avatar_response.text}")

            # Parse the response to get the avatar URL
            avatar_data = avatar_response.json()
            if "data" in avatar_data and avatar_data["data"]:
                avatar_url = avatar_data["data"][0]["imageUrl"]
            else:
                avatar_url = None
        else:
            avatar_url = None

        # Render the avatar page with the fetched avatar URL
        return render_template('avatar.html', username=username, avatar_url=avatar_url)

    except Exception as e:
        # Log any errors for debugging
        print(f"Error for username {username}: {e}")
        return render_template('avatar.html', username=username, avatar_url=None)

if __name__ == '__main__':
    app.run(debug=True)

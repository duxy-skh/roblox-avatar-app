from flask import Flask, render_template, request, jsonify, redirect, url_for
import requests

app = Flask(__name__)

# Serve the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Handle form submission and redirect to the avatar page
@app.route('/avatar', methods=['POST'])
def avatar_redirect():
    username = request.form.get('username', '').strip()
    if username:
        return redirect(url_for('avatar', username=username))
    return redirect(url_for('index'))

# Render the avatar page
@app.route('/avatar/<username>')
def avatar(username):
    try:
        # Call Roblox API to get user info
        api_url = "https://users.roblox.com/v1/usernames/users"
        payload = {"usernames": [username]}
        response = requests.post(api_url, json=payload)

        if response.status_code != 200:
            return render_template('avatar.html', username=username, avatar_url=None, error="Failed to fetch user data")

        data = response.json()

        if "data" in data and data["data"]:
            user_id = data["data"][0]["id"]

            # Fetch avatar URL from Roblox Thumbnails API
            avatar_api_url = f"https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds={user_id}&size=420x420&format=Png&isCircular=false"
            avatar_response = requests.get(avatar_api_url)

            if avatar_response.status_code != 200:
                return render_template('avatar.html', username=username, avatar_url=None, error="Failed to fetch avatar")

            avatar_data = avatar_response.json()
            if "data" in avatar_data and avatar_data["data"]:
                avatar_url = avatar_data["data"][0]["imageUrl"]
                return render_template('avatar.html', username=username, avatar_url=avatar_url, error=None)
            else:
                return render_template('avatar.html', username=username, avatar_url=None, error="Avatar not found")
        else:
            return render_template('avatar.html', username=username, avatar_url=None, error="User not found")

    except Exception as e:
        print(f"Error: {e}")
        return render_template('avatar.html', username=username, avatar_url=None, error="An unexpected error occurred")


if __name__ == '__main__':
    app.run(debug=True)

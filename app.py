from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get the username from the form and strip any extra spaces
        username = request.form.get('username').strip()
        if username:
            return redirect(url_for('avatar', username=username))
    return render_template('index.html')

@app.route('/avatar/<username>')
def avatar(username):
    try:
        # New Roblox API endpoint to fetch user data
        api_url = "https://users.roblox.com/v1/usernames/users"
        payload = {"usernames": [username]}  # API expects a list of usernames

        # Send POST request to Roblox API
        response = requests.post(api_url, json=payload)

        # Log the API response for debugging
        print(f"API Response for {username}: {response.text}")

        # Check if the API call was successful
        if response.status_code != 200:
            return render_template('avatar.html', username=username, avatar_url=None)

        data = response.json()

        # Check if user data exists in the API response
        if "data" in data and data["data"]:
            user_id = data["data"][0]["id"]  # Extract the user ID
            avatar_url = f"https://www.roblox.com/headshot-thumbnail/image?userId={user_id}&width=420&height=420&format=png"
        else:
            avatar_url = None  # No user found

        return render_template('avatar.html', username=username, avatar_url=avatar_url)

    except Exception as e:
        # Log any errors for debugging
        print(f"Error for username {username}: {e}")
        return render_template('avatar.html', username=username, avatar_url=None)

if __name__ == '__main__':
    app.run(debug=True)

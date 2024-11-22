from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get the username from the form
        username = request.form.get('username')
        if username:
            return redirect(url_for('avatar', username=username))
    return render_template('index.html')

@app.route('/avatar/<username>')
def avatar(username):
    try:
        # Roblox API URL to fetch user information by username
        api_url = f"https://api.roblox.com/users/get-by-username?username={username}"
        response = requests.get(api_url)

        # Check if the API call was successful
        if response.status_code != 200:
            return render_template('avatar.html', username=username, avatar_url=None)

        data = response.json()

        # Validate if the response contains a valid user ID
        if "Id" in data and data["Id"] is not None:
            user_id = data["Id"]

            # Generate the Roblox avatar image URL
            avatar_url = f"https://www.roblox.com/headshot-thumbnail/image?userId={user_id}&width=420&height=420&format=png"
        else:
            avatar_url = None  # User not found

        return render_template('avatar.html', username=username, avatar_url=avatar_url)

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error fetching data for username {username}: {e}")

        # Return a "user not found" message
        return render_template('avatar.html', username=username, avatar_url=None)

if __name__ == '__main__':
    app.run(debug=True)

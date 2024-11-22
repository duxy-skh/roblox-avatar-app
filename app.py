from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        return redirect(url_for('avatar', username=username))
    return render_template('index.html')

@app.route('/avatar/<username>')
def avatar(username):
    # Use the Roblox API to get user data by username
    api_url = f"https://api.roblox.com/users/get-by-username?username={username}"
    response = requests.get(api_url)

    # Default to no avatar URL
    avatar_url = None

    if response.status_code == 200:
        data = response.json()
        # Check if the user exists and extract their ID
        if "Id" in data and data["Id"] is not None:
            user_id = data["Id"]
            # Generate the Roblox avatar URL
            avatar_url = f"https://www.roblox.com/headshot-thumbnail/image?userId={user_id}&width=420&height=420&format=png"
    
    return render_template('avatar.html', username=username, avatar_url=avatar_url)

if __name__ == '__main__':
    app.run(debug=True)

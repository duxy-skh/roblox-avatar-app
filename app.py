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
    api_url = f"https://users.roblox.com/v1/users/search?keyword={username}&limit=1"
    response = requests.get(api_url).json()

    if "data" in response and response["data"]:
        user_id = response["data"][0]["id"]
        avatar_url = f"https://www.roblox.com/headshot-thumbnail/image?userId={user_id}&width=420&height=420&format=png"
    else:
        avatar_url = None

    return render_template('avatar.html', username=username, avatar_url=avatar_url)

if __name__ == '__main__':
    app.run(debug=True)

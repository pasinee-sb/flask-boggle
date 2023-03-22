from flask import Flask, request, render_template, session, jsonify, app
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle


app = Flask(__name__)
app.config['SECRET_KEY'] = "abc123"
app.config['TB_DEBUG_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)


my_board = Boggle()
set_of_word = []


@app.route('/', methods=["GET"])
def show_home():

    boggle_board = my_board.make_board()

    session['board'] = boggle_board
    times_played = session.get('times-played', 0)
    high_score = session.get("high-score", 0)
    print("high score: ", high_score)
    return render_template("boggle.html", boggle_game=boggle_board, high_score=high_score, times_played=times_played)


@app.route("/guessed")
def fetch_guessed():
    # On the server, take the form value and check if it is a valid word in the dictionary using the words variable in your app.py.
    board = session['board']

    guessed_word = request.args["word"]

    """Check for duplicate word, if not, move on to check valid word"""

    if guessed_word not in set_of_word:
        set_of_word.append(guessed_word)

        res = my_board.check_valid_word(board, guessed_word)
        return jsonify(result=res)

    else:
        return ("", 204)


@app.route("/check-score", methods=['POST'])
def new_high_score():
    high_score = session.get('high-score', 0)
    times_played = session.get('times-played', 0)
    score = request.json["score"]

    if score > high_score:
        high_score = score
        session['high-score'] = high_score

    result = session['high-score']
    session['times-played'] = times_played + 1

    print(result)
    return jsonify(high_score=result)

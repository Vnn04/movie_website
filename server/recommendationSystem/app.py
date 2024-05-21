import pandas as pd
from content_based import RecommendationContentBased
from collaborative import MovieRecommender
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load or train the collaborative filtering model
# def load_or_train_collaborative_model():
#     try:
#         recommender = joblib.load('collaborative_model.pkl')
#         print("Collaborative model loaded from file.")
#     except (FileNotFoundError, EOFError):
#         recommender = MovieRecommender(K=3, max_gradients=100)
#         recommender.load_data()
#         recommender.preprocess_data()
#         recommender.train(alpha=0.0001, beta=0.02)
#         joblib.dump(recommender, 'collaborative_model.pkl')
#         print("Collaborative model trained and saved to file.")
#     return recommender

def load_or_train_collaborative_model():
    recommender = MovieRecommender(K=3, max_gradients=100)
    recommender.load_data()
    recommender.preprocess_data()
    recommender.train(alpha=0.0001, beta=0.02)
    return recommender


recommender = load_or_train_collaborative_model()

content_based = RecommendationContentBased()
content_based.load_data()

@app.route('/recommend_by_movieID', methods=['POST'])
def recommend_by_movieID():
    data = request.get_json()
    movieID = data.get('movieID')
    result = content_based.get_recommendations(movieID)
    result = [int(id) for id in result]
    return jsonify({"result": result})

@app.route('/recommend_by_userID', methods=['POST'])
def recommend_by_userID():
    data = request.get_json()
    userID = data.get('userID')
    result = recommender.convert_to_origin_movieID(userID, top_n=20)
    result = list(result)
    result = [int(id) for id in result]
    return jsonify({"result": result})

@app.route('/add_new_user', methods=['POST'])
def add_new_user():
    data = request.get_json()
    id = data.get('id')
    gender = data.get('gender')
    date_of_birth = data.get('date_of_birth')
    new_user = [{'id': id, 'gender': gender, 'date_of_birth': date_of_birth}]
    new_user = pd.DataFrame(new_user)
    recommender.add_new_user(new_user)
    return jsonify({"message": "Add new user successfully"}), 200

@app.route('/add_new_movie', methods=['POST'])
def add_new_movie():
    # ['Science Fiction','TV Movie','Thriller','War','Western']
    data = request.get_json()
    id = data.get('id')
    action = data.get('Action')
    adventure = data.get('Adventure')
    animation = data.get('Animation')
    comedy = data.get('Comedy')
    crime = data.get('Crime')
    documentary = data.get('Documentary')
    drama = data.get('Drama')
    family = data.get('Family')
    fantasy = data.get('Fantasy')
    history = data.get('History')
    horror = data.get('Horror')
    music = data.get('Music')
    mystery = data.get('Mystery')
    romance = data.get('Romance')
    science = data.get('Science Fiction')
    tv = data.get('TV Movie')
    thriller = data.get("Thriller")
    war = data.get('War')
    western = data.get('Western')
    new_movie = [{'id': id, 'Action': action, 'Adventure': adventure, 'Animation': animation, 'Comedy': comedy, 'Crime': crime, 'Documentary': documentary,
                  'Drama': drama, 'Family': family, 'Fantasy': fantasy, 'History': history, 'Horror':horror, "Music": music, 
                  'Mystery': mystery, 'Romance': romance, 'Science Fiction': science, 'TV Movie': tv, 'Thriller':thriller, 'War': war, "Western": western}]
    new_movie = pd.DataFrame(new_movie)
    recommender.add_new_user(new_movie)
    return jsonify({"message": "Add new movie successfully"}), 200


@app.route('/update_rating', methods=['POST'])
def update_rating():
    data = request.get_json()
    userID = data.get('userID')
    movieID = data.get('movieID')
    rating = data.get('rating')
    recommender.update_rating(userID, movieID, rating)
    return jsonify({"message": "Update rating successfully"}), 200

@app.route('/update_view', methods=['POST'])
def update_view():
    data = request.get_json()
    userID = data.get('userID')
    movieID = data.get('movieID')
    view = data.get('view')
    recommender.update_rating(userID, movieID, view)
    return jsonify({"message": "Update view successfully"}), 200

@app.route('/update_watch_trailer', methods=['POST'])
def update_watch_trailer():
    data = request.get_json()
    userID = data.get('userID')
    movieID = data.get('movieID')
    watch = data.get('watch')
    recommender.update_rating(userID, movieID, watch)
    return jsonify({"message": "Update watch trailer successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True)

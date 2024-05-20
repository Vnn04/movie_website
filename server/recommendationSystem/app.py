import pandas as pd
from content_based import RecommendationContentBased
from collaborative import MovieRecommender
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load or train the collaborative filtering model
def load_or_train_collaborative_model():
    try:
        recommender = joblib.load('collaborative_model.pkl')
        print("Collaborative model loaded from file.")
    except (FileNotFoundError, EOFError):
        recommender = MovieRecommender(K=3, max_gradients=100)
        recommender.load_data()
        recommender.preprocess_data()
        recommender.train(alpha=0.0001, beta=0.02)
        joblib.dump(recommender, 'collaborative_model.pkl')
        print("Collaborative model trained and saved to file.")
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

if __name__ == "__main__":
    app.run(debug=True)

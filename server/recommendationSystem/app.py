from rating import RatingBasedRecommender
from view import ViewBasedRecommender
from watch_trailer import WatchTrailerBasedRecommender
from content_based import RecommendationContentBased
from flask import Flask, request, jsonify

app = Flask(__name__)

rating_recommend = RatingBasedRecommender()
rating_recommend.load_data()
rating_recommend.preprocess_data()
view_recommend = ViewBasedRecommender()
view_recommend.load_data()
view_recommend.preprocess_data()
watch_trailer_recommend = WatchTrailerBasedRecommender()
watch_trailer_recommend.load_data()
watch_trailer_recommend.preprocess_data()
content_based = RecommendationContentBased()

rating_recommend.train()

view_recommend.train()

watch_trailer_recommend.train()

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

    ratings = rating_recommend.recommend_movies(user_id=userID)
    views = view_recommend.recommend_movies(user_id=userID)
    watch_trailer = watch_trailer_recommend.recommend_movies(user_id=userID)

    result = set(ratings).union(views, watch_trailer)
    result = list(result)

    result = [int(id) for id in result]
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(debug=True)


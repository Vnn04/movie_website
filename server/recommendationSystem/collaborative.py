from rating import RatingBasedRecommender
from view import ViewBasedRecommender
from watch_trailer import WatchTrailerBasedRecommender

rating_recommend = RatingBasedRecommender()
rating_recommend.load_data()
rating_recommend.preprocess_data()
rating_recommend.train()


view_recommend = ViewBasedRecommender()
watch_trailer_recommend = WatchTrailerBasedRecommender()


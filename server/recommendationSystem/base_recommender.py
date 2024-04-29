import numpy as np 
import pandas as pd 
import warnings
from sklearn.decomposition import TruncatedSVD
from datetime import datetime
from sqlalchemy import create_engine

class BaseRecommender:
    """Base class for movie recommender systems."""
    def __init__(self, K=3):
        self.K = K
        self.P = None
        self.Q = None
        self.R = None
        self.unique_movie_ids = None
        self.movie_id_map = None
        self.users = None
        self.movies = None

    def load_data(self):
        raise NotImplementedError("Subclasses should implement this method")

    def preprocess_data(self):
        raise NotImplementedError("Subclasses should implement this method")

    def train(self):
        raise NotImplementedError("Subclasses should implement this method")

    def update_P_and_Q(self, user_id, item_id, rating, alpha, beta):
        prediction = self.predict(user_id, item_id)
        e = rating - prediction
        self.P[user_id, :] += alpha * (e * self.Q[item_id, :] - beta * self.P[user_id, :])
        self.Q[item_id, :] += alpha * (e * self.P[user_id, :] - beta * self.Q[item_id, :])

    def predict(self, user_id, item_id):
        return self.P[user_id, :].dot(self.Q[item_id, :].T)

    def recommend_movies(self, user_id, top_n=10):
        unseen_movies = np.where(self.R[user_id, :] == 0)[0]
        predicted_ratings = [self.predict(user_id, movie_id) for movie_id in unseen_movies]
        recommended_movie_ids = np.argsort(predicted_ratings)[-top_n:]
        movies_recommended = self.movies.iloc[recommended_movie_ids]['movieID'].values
        origin_movieID = [self.unique_movie_ids[index] for index in movies_recommended]
        return origin_movieID

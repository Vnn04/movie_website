import numpy as np
import pandas as pd
import warnings
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
from sqlalchemy import create_engine

warnings.filterwarnings("ignore")


class MovieRecommender:
    def __init__(self, K=3, max_gradients=100):
        self.K = K
        self.P = None
        self.Q = None
        self.R = None
        self.unique_movie_ids = None
        self.movie_id_map = None
        self.users = None
        self.movies = None
        self.ratings = None
        self.views = None
        self.watch_trailer = None
        self.task_gradients = []
        self.max_gradients = max_gradients

    def load_data(self):
        engine = create_engine('mysql+pymysql://root:vnn04@localhost:3307/mlops')
        self.views = pd.read_sql_query('SELECT * FROM Viewed', con=engine)
        self.watch_trailer = pd.read_sql_query('SELECT * FROM watch_trailer', con=engine)
        self.ratings = pd.read_sql_query('SELECT * FROM rating', con=engine)
        self.users = pd.read_sql_query('SELECT id, gender, date_of_birth FROM Users', con=engine)
        self.movies = pd.read_sql_query('SELECT * FROM Movies', con=engine)
        self.movies = self.movies[['id','Action','Adventure','Animation','Comedy','Crime','Documentary','Drama','Family','Fantasy','History','Horror','Music','Mystery','Romance','Science Fiction','TV Movie','Thriller','War','Western']]

    def preprocess_data(self):
        now = datetime.now()
        self.users['age'] = (now - pd.to_datetime(self.users['date_of_birth'])).dt.total_seconds() // (60*60*24*365.25)
        self.users = self.users.drop(columns=['date_of_birth'])

        self.unique_movie_ids = self.ratings['movieID'].unique()
        self.movie_id_map = {id: i for i, id in enumerate(self.unique_movie_ids)}

        self.ratings['movieID'] = self.ratings['movieID'].map(self.movie_id_map)
        self.movies['id'] = self.movies['id'].map(self.movie_id_map)
        self.views['movieID'] = self.views['movieID'].map(self.movie_id_map)
        self.watch_trailer['movieID'] = self.watch_trailer['movieID'].map(self.movie_id_map)

        self.R = np.zeros((self.users.shape[0], self.movies.shape[0], 3))
        for row in self.ratings.itertuples():
            user_id = row[1]
            movie_id = row[2] 
            rating = row[3]
            self.R[user_id, movie_id, 0] = rating
        for row in self.views.itertuples():
            user_id = row[1]
            movie_id = row[2] 
            view = row[3]
            self.R[user_id, movie_id, 1] = view
        for row in self.watch_trailer.itertuples():
            user_id = row[1]
            movie_id = row[2] 
            watch = row[3]
            self.R[user_id, movie_id, 2] = watch

    def train(self, alpha=0.0001, beta=0.02):
        svd = TruncatedSVD(n_components=self.K)
        self.P = svd.fit_transform(self.users)
        self.Q = svd.fit_transform(self.movies)

        for user_id in range(len(self.users)):
            for item_id in range(len(self.movies)):
                rating = self.ratings[(self.ratings['userID'] == user_id) & (self.ratings['movieID'] == item_id)]['rating']
                view = self.views[(self.views['userID'] == user_id) & (self.views['movieID'] == item_id)]['view']
                watch = self.watch_trailer[(self.watch_trailer['userID'] == user_id) & (self.watch_trailer['movieID'] == item_id)]['watch']
                if not rating.empty and rating.values[0] > 0:
                    self.update_P_and_Q(user_id, item_id, rating.values[0], alpha, beta, method='rating')
                if not view.empty and view.values[0] > 0:
                    self.update_P_and_Q(user_id, item_id, view.values[0], alpha, beta, method='view')
                if not watch.empty and watch.values[0] > 0:
                    self.update_P_and_Q(user_id, item_id, watch.values[0], alpha, beta, method='watch')

    def update_P_and_Q(self, user_id, item_id, value, alpha, beta, method):
        if method == 'rating':
            prediction = self.predict_rating(user_id, item_id)
        elif method == 'view':
            prediction = self.predict_view(user_id, item_id)
        elif method == 'watch':
            prediction = self.predict_watch(user_id, item_id)
        e = value - prediction

        dp = e * self.Q[item_id, :] - beta * self.P[user_id, :]
        dq = e * self.P[user_id, :] - beta * self.Q[item_id, :]

        self.task_gradients.append((dp, dq))

        if len(self.task_gradients) > self.max_gradients:
            self.task_gradients.pop(0)

        # Update P and Q
        for dp_task, dq_task in self.task_gradients:
            if np.dot(dp, dp_task) + np.dot(dq, dq_task) < 0:
                dp -= np.dot(dp, dp_task) / np.dot(dp_task, dp_task) * dp_task
                dq -= np.dot(dq, dq_task) / np.dot(dq_task, dq_task) * dq_task

        self.P[user_id, :] += alpha * dp
        self.Q[item_id, :] += alpha * dq

    def predict_rating(self, user_id, item_id):
        return self.P[user_id, :].dot(self.Q[item_id, :].T)

    def predict_view(self, user_id, item_id):
        return self.P[user_id, :].dot(self.Q[item_id, :].T)

    def predict_watch(self, user_id, item_id):
        return self.P[user_id, :].dot(self.Q[item_id, :].T)
    

    def recommend_movies(self, user_id, top_n=10):
        unseen_movies = np.where(self.R[user_id, :, 0] == 0)[0]
        predicted_ratings = [self.predict_rating(user_id, movie_id) for movie_id in unseen_movies]
        predicted_views = [self.predict_view(user_id, movie_id) for movie_id in unseen_movies]
        predicted_watch = [self.predict_watch(user_id, movie_id) for movie_id in unseen_movies]
        predicted_scores = [r + v + w for r, v, w in zip(predicted_ratings, predicted_views, predicted_watch)]
        recommended_movie_ids = np.argsort(predicted_scores)[-top_n:]
        recommended_movies = self.movies.iloc[recommended_movie_ids]
        return recommended_movies

    def convert_to_origin_movieID(self, user_id, top_n=10):
        movies_recommended = self.recommend_movies(user_id,top_n)['id'].values
        origin_movieID = [self.unique_movie_ids[index] for index in movies_recommended]
        return origin_movieID

    def add_new_user(self, user):
        self.users = pd.concat([self.users, user], ignore_index=True)        #
        new_P_row = np.random.rand(1, self.K)
        self.P = np.vstack([self.P, new_P_row])
        new_R_row = np.zeros((1, self.movies.shape[0], 3))
        self.R = np.concatenate([self.R, new_R_row], axis=0)

    def add_new_movie(self, movie):
        self.movies = pd.concat([self.movies, movie], ignore_index=True)
        new_Q_row = np.random.rand(1, self.K)
        self.Q = np.vstack([self.Q, new_Q_row])
        new_R_column = np.zeros((self.users.shape[0], 1, 3))
        self.R = np.concatenate([self.R, new_R_column], axis=1)

    def get_index_from_original_movie_id(self, original_id):
        return self.movie_id_map[original_id]

    def update_rating(self, user_id, movie_id, rating):
        movie_id = self.get_index_from_original_movie_id(movie_id)
        self.R[user_id, movie_id, 0] = rating
        self.update_P_and_Q(user_id, movie_id, rating, alpha=0.0001, beta=0.02, method='rating')

    def update_view(self, user_id, movie_id, view):
        movie_id = self.get_index_from_original_movie_id(movie_id)
        self.R[user_id, movie_id, 1] = view
        self.update_P_and_Q(user_id, movie_id, view, alpha=0.0001, beta=0.02, method='view')

    def update_watch_trailer(self, user_id, movie_id, watch):
        movie_id = self.get_index_from_original_movie_id(movie_id)
        self.R[user_id, movie_id, 2] = watch
        self.update_P_and_Q(user_id, movie_id, watch, alpha=0.0001, beta=0.02, method='watch')

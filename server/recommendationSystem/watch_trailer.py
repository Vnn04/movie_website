import numpy as np
import pandas as pd
import warnings
from sklearn.decomposition import TruncatedSVD
from datetime import datetime
from sqlalchemy import create_engine
from base_recommender import BaseRecommender
from joblib import Parallel, delayed


warnings.filterwarnings('ignore')


class WatchTrailerBasedRecommender(BaseRecommender):
    """A movie recommender system based on watchs."""
    def load_data(self):
        engine = create_engine('mysql+pymysql://root:vnn04@localhost/mlops')
        self.watch_trailers = pd.read_sql_query('SELECT * FROM watch_trailer', con=engine)
        self.users = pd.read_sql_query('SELECT id, gender, date_of_birth FROM user', con=engine)
        self.movies = pd.read_sql_query('SELECT * FROM movie', con=engine)
        self.movies = self.movies[['movieID','Action','Adventure','Animation','Comedy','Crime','Documentary','Drama','Family','Fantasy','History','Horror','Music','Mystery','Romance','Science Fiction','TV Movie','Thriller','War','Western']]

    def preprocess_data(self):
        now = datetime.now()
        self.users['age'] = (now - pd.to_datetime(self.users['date_of_birth'])).dt.total_seconds() // (60*60*24*365.25)
        self.users = self.users.drop(columns=['date_of_birth'])

        self.unique_movie_ids = self.watch_trailers['movieID'].unique()
        self.movie_id_map = {id: i for i, id in enumerate(self.unique_movie_ids)}

        self.watch_trailers['movieID'] = self.watch_trailers['movieID'].map(self.movie_id_map)
        self.movies['movieID'] = self.movies['movieID'].map(self.movie_id_map)

        self.R = np.zeros((self.users.shape[0], self.movies.shape[0]))

        for row in self.watch_trailers.itertuples():
            user_id = row[1]
            movie_id = row[2]
            watch = row[3]
            self.R[user_id, movie_id] = watch

    def train(self, alpha=0.0001, beta=0.02):
        svd = TruncatedSVD(n_components=self.K)
        self.P = svd.fit_transform(self.users)
        self.Q = svd.fit_transform(self.movies)

        def train_single(user_id):
            for item_id in range(len(self.movies)):
                watch = self.watch_trailers[(self.watch_trailers['userID'] == user_id) & (self.watch_trailers['movieID'] == item_id)]['watch']
                if not watch.empty and watch.values[0] > 0:
                    self.update_P_and_Q(user_id, item_id, watch.values[0], alpha, beta)

        Parallel(n_jobs=-1)(delayed(train_single)(user_id) for user_id in range(len(self.users)))

import numpy as np
import pandas as pd
import warnings
from sklearn.decomposition import TruncatedSVD
from datetime import datetime
from sqlalchemy import create_engine
from base_recommender import BaseRecommender
from joblib import Parallel, delayed

warnings.filterwarnings('ignore')

class ViewBasedRecommender(BaseRecommender):
    """A movie recommender system based on views."""
    def load_data(self):
        engine = create_engine('mysql+pymysql://root:123456@localhost:3307/BTLthpt')
        self.views = pd.read_sql_query('SELECT * FROM Viewed', con=engine)
        self.users = pd.read_sql_query('SELECT id, gender, date_of_birth FROM Users', con=engine)
        self.movies = pd.read_sql_query('SELECT * FROM Movies', con=engine)
        self.movies = self.movies[['id','Action','Adventure','Animation','Comedy','Crime','Documentary','Drama','Family','Fantasy','History','Horror','Music','Mystery','Romance','Science Fiction','TV Movie','Thriller','War','Western']]

    def preprocess_data(self):
        now = datetime.now()
        self.users['age'] = (now - pd.to_datetime(self.users['date_of_birth'])).dt.total_seconds() // (60*60*24*365.25)
        self.users = self.users.drop(columns=['date_of_birth'])

        self.unique_movie_ids = self.views['movieID'].unique()
        self.movie_id_map = {id: i for i, id in enumerate(self.unique_movie_ids)}

        self.views['movieID'] = self.views['movieID'].map(self.movie_id_map)
        self.movies['id'] = self.movies['id'].map(self.movie_id_map)

        self.R = np.zeros((self.users.shape[0], self.movies.shape[0]))

        for row in self.views.itertuples():
            user_id = row[2]
            movie_id = row[3]
            view = row[4]
            self.R[user_id, movie_id] = view

    def train(self, alpha=0.0001, beta=0.02):
        svd = TruncatedSVD(n_components=self.K)
        self.P = svd.fit_transform(self.users)
        self.Q = svd.fit_transform(self.movies)

        def train_single(user_id):
            for item_id in range(len(self.movies)):
                view = self.views[(self.views['userID'] == user_id) & (self.views['movieID'] == item_id)]['view']
                if not view.empty and view.values[0] > 0:
                    self.update_P_and_Q(user_id, item_id, view.values[0], alpha, beta)

        Parallel(n_jobs=-1)(delayed(train_single)(user_id) for user_id in range(len(self.users)))


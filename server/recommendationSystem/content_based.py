import pandas as pd 
from sqlalchemy import create_engine
from sklearn.metrics.pairwise import cosine_similarity

class RecommendationContentBased:
    def __init__(self):
        self.movies = None
        self.movie_features = None
        self.cosine_sim = None
        self.indices = None

    def load_data(self):
        engine = create_engine('mysql+pymysql://root:vnn04@localhost:3307/mlops')
        self.movies = pd.read_sql_query('SELECT * FROM Movies', con=engine)
        self.movie_features = self.movies[["id",'Adventure','Animation','Comedy','Crime','Documentary','Drama','Family','Fantasy','History','Horror','Music','Mystery','Romance','Science Fiction','TV Movie','Thriller','War','Western']]
        self.cosine_sim = cosine_similarity(self.movie_features.iloc[:, 1:], self.movie_features.iloc[:, 1:])
        self.indices = pd.Series(self.movie_features.index, index=self.movie_features['id']).drop_duplicates()

    def get_recommendations(self, movieID):
        idx = self.indices[movieID]
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x : x[1], reverse=True)
        sim_scores = sim_scores[1:16]
        movie_indices = [i[0] for i in sim_scores]
        return self.movie_features['id'].iloc[movie_indices].values



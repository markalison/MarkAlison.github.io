from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

# Sample DataFrame (replace with actual data fetching)
data = {
    'name': ['Game1', 'Game2', 'Game3'],
    'genre': ['Action', 'RPG', 'Strategy'],
    'difficulty': ['Easy', 'Hard', 'Medium'],
    'time_to_beat': [10, 40, 25]
}

df = pd.DataFrame(data)

# Encode categorical data
le_genre = LabelEncoder()
le_difficulty = LabelEncoder()
df['genre_encoded'] = le_genre.fit_transform(df['genre'])
df['difficulty_encoded'] = le_difficulty.fit_transform(df['difficulty'])

# Final DataFrame
df_encoded = df[['genre_encoded', 'difficulty_encoded', 'time_to_beat']]

# Fit KNN model
knn = NearestNeighbors(n_neighbors=3, metric='euclidean')
knn.fit(df_encoded)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend_games():
    query = request.json
    genre = le_genre.transform([query['genre']])[0]
    difficulty = le_difficulty.transform([query['difficulty']])[0]
    time_to_beat = query['time_to_beat']
    query_encoded = [genre, difficulty, time_to_beat]
    distances, indices = knn.kneighbors([query_encoded])
    recommendations = df.iloc[indices[0]].to_dict(orient='records')
    return jsonify(recommendations)

@app.route('/options')
def get_options():
    genres = df['genre'].unique().tolist()
    difficulties = df['difficulty'].unique().tolist()
    durations = sorted(df['time_to_beat'].unique().tolist())
    return jsonify({
        'genres': genres,
        'difficulties': difficulties,
        'durations': durations
    })

if __name__ == '__main__':
    app.run(debug=True)

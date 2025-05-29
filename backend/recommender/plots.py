import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import os

def plot_genre_distribution(movies):
    os.makedirs('static/plots', exist_ok=True)  # 👈 THÊM DÒNG NÀY
    genres = movies['genres'].str.split('|').explode().value_counts()
    plt.figure(figsize=(10, 6))
    sns.barplot(x=genres.values, y=genres.index)
    plt.title('Genre Distribution')
    plt.xlabel('Count')
    plt.ylabel('Genre')
    plt.savefig('static/plots/genre_distribution.png')
    plt.close()

def plot_rating_distribution(ratings):
    os.makedirs('static/plots', exist_ok=True)  # 👈 THÊM DÒNG NÀY
    plt.figure(figsize=(10, 6))
    sns.histplot(ratings['rating'], bins=10)
    plt.title('Rating Distribution')
    plt.xlabel('Rating')
    plt.ylabel('Count')
    plt.savefig('static/plots/rating_distribution.png')
    plt.close()

def plot_correlation_matrix(movies, ratings):
    os.makedirs('static/plots', exist_ok=True)
    data = ratings.groupby('movieId')['rating'].mean().reset_index()
    data = data.merge(movies[['movieId', 'genres']], on='movieId')
    data['year'] = data['genres'].str.extract(r'\((\d{4})\)')
    data['year'] = pd.to_numeric(data['year'], errors='coerce')
    
    # 🔥 Chỉ giữ lại các cột số
    numeric_data = data.select_dtypes(include=['number'])

    plt.figure(figsize=(10, 6))
    sns.heatmap(numeric_data.corr(), annot=True, cmap='coolwarm')
    plt.title('Correlation Matrix')
    plt.savefig('static/plots/correlation_matrix.png')
    plt.close()
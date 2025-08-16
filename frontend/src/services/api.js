const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

class ApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name, email, password) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User Profile
  async updateProfile(updates) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // My List
  async addToMyList(movieId) {
    return this.request('/user/my-list', {
      method: 'POST',
      body: JSON.stringify({ movie_id: movieId, action: 'add' }),
    });
  }

  async removeFromMyList(movieId) {
    return this.request('/user/my-list', {
      method: 'POST',
      body: JSON.stringify({ movie_id: movieId, action: 'remove' }),
    });
  }

  async getMyList() {
    return this.request('/user/my-list');
  }

  // Watch History
  async updateWatchHistory(movieId, progress, completed = false) {
    return this.request('/user/watch-history', {
      method: 'POST',
      body: JSON.stringify({
        movie_id: movieId,
        progress,
        completed
      }),
    });
  }

  async getWatchHistory() {
    return this.request('/user/watch-history');
  }

  // Content
  async getNetflixContent() {
    return this.request('/content/netflix');
  }

  async getTrending() {
    return this.request('/content/trending');
  }

  async getPopular() {
    return this.request('/content/popular');
  }

  async searchContent(query, page = 1) {
    return this.request(`/content/search?q=${encodeURIComponent(query)}&page=${page}`);
  }

  async getGenres() {
    return this.request('/content/genres');
  }

  async getContentByGenre(genreId, page = 1) {
    return this.request(`/content/genre/${genreId}?page=${page}`);
  }

  async getMovieDetails(movieId) {
    return this.request(`/content/movie/${movieId}`);
  }

  async getTvDetails(tvId) {
    return this.request(`/content/tv/${tvId}`);
  }
}

export const apiService = new ApiService();
export default apiService;
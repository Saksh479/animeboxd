import './App.css';
import MovieCard from './components/MovieCard';
import Search from './components/Search';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );
  updateSearchCount();


  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('')

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?region=JP&page=1&query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?page=1&sort_by=popularity.desc&with_origin_country=JP&with_original_language=ja`
      const response = await fetch(endpoint, options)
      if (!response.ok) {
        throw new Error('Failed to fetch movies. Try again.')
      }
      const data = await response.json()
      console.log(data)

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovies([]);
        return;
      }
      setMovies(data.results || [])

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (err) {
      setErrorMessage(`Error Fetching Message: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const trenMovies = await getTrendingMovies();
      setTrendingMovies(trenMovies);
    } catch (err) {
      console.error('Error fetching trending movies:', err);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="wrapper">
        <h1 className="text-amber-300 font-bold">
          Welcome to <span className="text-gradient">JapBoxd</span>
        </h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {trendingMovies.length > 0 && (
        <section className='trending'>
          <h2 className='mt-[20px] text-yellow-400  text-shadow-lg/30'>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.movie_id} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className='all-movies'>

        <h2 className='mt-[20px] text-yellow-400 text-shadow-lg/30'>All Movies</h2>
        {isLoading ? (
          <p >Loading...</p>
        ) : errorMessage ? (
          <p className='text-red-500'>Error: {errorMessage}</p>
        ) : (
          <ul>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )
        }
      </section>
    </main>
  );
};

export default App;

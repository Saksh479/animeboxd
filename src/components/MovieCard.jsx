import React from "react"

export const MovieCard = ({ movie:
  { title, vote_average, release_date, poster_path, overviews, id, genre, popularity }
}) => {
  return (
    <div className="movie-card">
      <img src={poster_path ?
        `https://image.tmdb.org/t/p/w500/${poster_path}` : 'game.jpg'
      } />
      <h3 className='mt-4'>{title}</h3>
      <div className="content">
        <div className="rating">
          <img src='star.png' alt='star' />
          <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          <span>•</span>
          <p className='year'>     {release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}
export default MovieCard

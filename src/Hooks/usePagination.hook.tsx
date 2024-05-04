import React, { useEffect, useState } from 'react'
import MovieType from '../Constants/Types/Movie.type';
import axios from 'axios';

export interface MovieFilter {
  genre: string;
}
export interface MovieStateType {
  year: number;
  result: Array<MovieType>
}

const getMovieService = (filter: MovieFilter, year: number) => {
  return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100&with_genres=${filter.genre}`)
}

const usePagination = (initialFilter: MovieFilter, defaultYear: number) => {
  const [filter, setFilter] = useState<MovieFilter>(initialFilter);
  const [filteredMovies, setFilteredMovies] = useState<MovieStateType[]>([]); // Assuming Movie interface is defined
  const [isLoading, setIsLoading] = useState(false)

  /**
 * Function to check if a movie year is already fetched or if it's a future year.
 * @param year - The year of the movie to check.
 * @returns True if the year is already fetched or if it's a future year, false otherwise.
 */
  const updateFilter = (year: number) => {

    // Check if the year is already fetched in the filteredMovies array
    if (filteredMovies.some(item => item.year === year)) {
      return true
    }

    // Check if the year is a future year
    if (year > new Date().getFullYear()) {
      return true
    }

    return false;
  }

  /**
 * Function to update the genre filter.
 *
 * @param genre - The new genre to filter movies by.
 * @returns {void}
 *
 * @remarks
 * This function updates the genre filter in the state.
 * It uses the spread operator to create a new object with the updated genre.
 * The filter object is then passed to the setFilter function to update the state.

 */
  const updateGenre = (genre: string): void => {
    setFilter({
      ...filter,
      genre: genre
    })
  }

  /**
 * A private function to make an API call and set the initial movies data.
 *
 * @remarks
 * This function is called when the component mounts and updates when the genre filter changes.
 * It fetches the movies for the default year and sets the first 10 movies in the filteredMovies state.
 *
 * @internal
 *
 */
  const _callApi = async () => {
    const res = await getMovieService({
      genre: initialFilter.genre
    }, defaultYear)

    setFilteredMovies([
      {
        year: defaultYear,
        result: res.data.results.slice(0, 10)
      }
    ])
  }

  /**
 * Function to fetch more movies based on the given year and genre.
 *
 * @param year - The year for which to fetch movies.
 * @param previousYear - A flag indicating whether to prepend the fetched movies to the existing list (default is false).
 *
 * @remarks
 * This function checks if the year is already fetched or if it's a future year.
 * If the year is valid, it makes an API call to fetch movies for the given year and genre.
 * The fetched movies are then added to the filteredMovies state.
 * If the previousYear flag is true, the fetched movies are prepended to the existing list.
 *
 * @internal
 *
 */
  const getMoreMovies = async (year: number, previousYear = false) => {
    const error = updateFilter(year)
    if (error || isLoading)
      return;
    setIsLoading(true)

    const res = await getMovieService({
      genre: initialFilter.genre
    },
      year,

    )
    if (!previousYear)
      setFilteredMovies([
        ...filteredMovies,
        {
          year: year,
          result: res.data.results
        }
      ])
    else {
      setFilteredMovies((pre) => [
        {
          year: year,
          result: res.data.results
        },
        ...pre,
      ])

    }
    setIsLoading(false)
  }

  useEffect(() => {
    _callApi()

  }, [filter.genre]);

  return { filter, filteredMovies, getMoreMovies, isLoading, updateGenre };
};

export default usePagination;
import genres from "../data/genres";
import conditions from "../data/conditions";
import fetchData from "./fetchData";
import type { Movie } from "../types/movie";

const infiniteScrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      infiniteScrollObserver.unobserve(entry.target);
      loadContents();
    }
  });
});

let i = 0;
const max = conditions.length + genres.length;

const getMovieData = async () => {
  let url: string;
  let heading: string;

  if (i < conditions.length) {
    const { name, en } = conditions[i];
    heading = name;
    url = `https://api.themoviedb.org/3/movie/${en}?language=ja&page=1`;
  } else if (i < genres.length) {
    const { id, name } = genres[i];
    heading = name;
    url = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}`;
  } else return;

  const movies = (await fetchData(url)) as Movie[];
  if (!movies) return;

  return { movies, heading };
};

const insertMovieSection = async (
  heading: string,
  container: HTMLElement,
  movies: Movie[],
) => {
  const movieListHtml = movies
    .map((movie) => {
      const roundedRatingNumber = parseFloat(
        movie.vote_average.toFixed(1),
      ).toLocaleString("ja");
      return `
          <li class="movieList__item">
            <div class="movieList__imageWrapper">
              <img
                src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${movie.poster_path}"
                alt=""
                width="{150}"
                height="{225}"
                class="movieList__image"
              />
            </div>
            <div class="movieList__title">${movie.title}</div>
            <div class="movieList__rating">${roundedRatingNumber}/10</div>
          </li>
        `;
    })
    .join("");

  const movieSectionHtml = `
          <li class="list__item">
            <h2 class="heading">${heading}</h2>
            <div class="movieList">
              <ul
                class="movieList__list is-overflowing"
                data-movie-list="now-playing"
              >
                ${movieListHtml}
              </ul>
            </div>
          </li>
        `;

  container.insertAdjacentHTML("beforeend", movieSectionHtml);
};

const loadContents = async () => {
  const container = document.querySelector<HTMLElement>("[data-container");
  if (!container) return;

  const movieData = await getMovieData();
  if (!movieData) return;

  const { movies, heading } = movieData;

  insertMovieSection(heading, container, movies);

  i++;

  const lastElementInContainer = container.lastElementChild;
  if (!lastElementInContainer) return;

  if (i < max) infiniteScrollObserver.observe(lastElementInContainer);
};

export default loadContents;

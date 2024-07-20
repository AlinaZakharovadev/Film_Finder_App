// Переменные, основные данные

const tmdbKey = "dc87fc402b0b479537e42bc19a31eb16";
const tmdbBaseUrl = "https://api.themoviedb.org/3";
const playBtn = document.getElementById("playBtn");
const likedMovies = [];
const dislikedMovies = [];

// Получение жанров фильмов

const getGenres = async () => {
  const genreRequestEndpoint = "genre/movie/list";
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}/${genreRequestEndpoint}${requestParams}`;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const genres = jsonResponse.genres;
      return genres;
    }
  } catch (error) {
    console.log(error);
  }
};

// Заполнение выпадающего списка (select) с жанрами фильмов
// Populate dropdown menu with all the available genres

const populateGenreDropdown = (genres) => {
  const select = document.getElementById("genres");

  for (const genre of genres) {
    let option = document.createElement("option");
    option.value = genre.id;
    option.text = genre.name;
    select.appendChild(option);
  }
};

// Получение выбранного жанра
// Returns the current genre selection from the dropdown menu

const getSelectedGenre = () => {
  const selectedGenre = document.getElementById("genres").value;
  return selectedGenre;
};

// Создание элементов для отображения информации о фильме

// Create HTML for movie poster
const createMoviePoster = (posterPath) => {
  const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;

  const posterImg = document.createElement("img");
  posterImg.setAttribute("src", moviePosterUrl);
  posterImg.setAttribute("class", "movieInfo__poster");

  return posterImg;
};
// Create HTML for movie title
const createMovieTitle = (title) => {
  const titleHeader = document.createElement("h1");
  titleHeader.setAttribute("id", "movieTitle");
  titleHeader.innerHTML = title;

  return titleHeader;
};
// Create HTML for movie overview
const createMovieOverview = (overview) => {
  const overviewParagraph = document.createElement("p");
  overviewParagraph.setAttribute("id", "movieOverview");
  overviewParagraph.innerHTML = overview;

  return overviewParagraph;
};
// Create HTML for release date
const createMovieReleaseDate = (releaseDate) => {
  const releaseDateParagraph = document.createElement("p");
  releaseDateParagraph.setAttribute("id", "movieReleaseDate");
  releaseDateParagraph.innerHTML = `Release Date: ${releaseDate}`;

  return releaseDateParagraph;
};
// Create HTML for movie cast
const createMovieCast = (cast) => {
  const castParagraph = document.createElement("p");
  castParagraph.setAttribute("id", "movieCast");
  castParagraph.innerHTML = `Cast: ${cast
    .map((actor) => actor.name)
    .join(", ")}`;

  return castParagraph;
};

// Получение фильмов

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = "discover/movie";
  const randomPage = Math.floor(Math.random() * 500) + 1; // случайная страница от 1 до 500
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&page=${randomPage}`;
  const urlToFetch = `${tmdbBaseUrl}/${discoverMovieEndpoint}${requestParams}`;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movies = jsonResponse.results;
      return movies;
    }
  } catch (error) {
    console.log(error);
  }
};

// Получение информации о фильме

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}&append_to_response=credits`;
  const urlToFetch = `${tmdbBaseUrl}/${movieEndpoint}${requestParams}`;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movieInfo = jsonResponse;
      return movieInfo;
    }
  } catch (error) {
    console.log(error);
  }
};

// Получение случайного фильма
// Returns a random movie from the first page of movies

const getRandomMovie = (movies) => {
  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];
  return randomMovie;
};

// Показ случайного фильма
// Gets a list of movies and ultimately displays the info of a random movie from the list

const showRandomMovie = async () => {
  const movieInfo = document.getElementById("movieInfo");
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  }
  const movies = await getMovies();
  const randomMovie = getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);
  displayMovie(info);
};

// Отображение информации о фильме
// Uses the DOM to create HTML to display the movie

const displayMovie = (movieInfo) => {
  const moviePosterDiv = document.querySelector(".movieInfo__poster");
  const movieTextDiv = document.querySelector(".movieInfo__text");
  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");
  // Create HTML content containing movie info
  const moviePoster = createMoviePoster(movieInfo.poster_path);
  const titleHeader = createMovieTitle(movieInfo.title);
  const overviewText = createMovieOverview(movieInfo.overview);
  const releaseDate = createMovieReleaseDate(movieInfo.release_date);
  const cast = createMovieCast(movieInfo.credits.cast.slice(0, 5)); // создает элемент с кратким списком актёров (первые 5)
  // Append title, poster, and overview to page
  moviePosterDiv.appendChild(moviePoster);
  movieTextDiv.appendChild(titleHeader);
  movieTextDiv.appendChild(overviewText);
  movieTextDiv.appendChild(releaseDate);
  movieTextDiv.appendChild(cast);

  showBtns();
  likeBtn.onclick = likeMovie;
  dislikeBtn.onclick = dislikeMovie;
};

// Показ кнопок
// Displays the like and dislike buttons on the page

const showBtns = () => {
  const btnDiv = document.getElementById("likeOrDislikeBtns");
  btnDiv.removeAttribute("hidden");
};

// Очистка текущего фильма
// Clear the current movie from the screen

const clearCurrentMovie = () => {
  const moviePosterDiv = document.querySelector(".movieInfo__poster");
  const movieTextDiv = document.querySelector(".movieInfo__text");
  moviePosterDiv.innerHTML = "";
  movieTextDiv.innerHTML = "";
};

// Лайк и дизлайк фильма

// After liking a movie, clears the current movie from the screen and gets another random movie
const likeMovie = () => {
  const movieTitle = document.getElementById("movieTitle").innerHTML;
  likedMovies.push(movieTitle);
  updateLikedMoviesList();
  clearCurrentMovie();
  showRandomMovie();
};

// After disliking a movie, clears the current movie from the screen and gets another random movie
const dislikeMovie = () => {
  const movieTitle = document.getElementById("movieTitle").innerHTML;
  dislikedMovies.push(movieTitle);
  updateDislikedMoviesList();
  clearCurrentMovie();
  showRandomMovie();
};

// Обновление списка понравившихся и не понравившихся фильмов

const updateLikedMoviesList = () => {
  const likedMoviesDiv = document.getElementById("likedMovies");
  likedMoviesDiv.innerHTML = "";
  likedMovies.forEach((movie) => {
    const movieElement = document.createElement("li");
    movieElement.innerText = movie;
    likedMoviesDiv.appendChild(movieElement);
  });
};

const updateDislikedMoviesList = () => {
  const dislikedMoviesDiv = document.getElementById("dislikedMovies");
  dislikedMoviesDiv.innerHTML = "";
  dislikedMovies.forEach((movie) => {
    const movieElement = document.createElement("li");
    movieElement.innerText = movie;
    dislikedMoviesDiv.appendChild(movieElement);
  });
};

// Инициализация

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;

// Film Finder
// You’ve caught up on your list of TV shows and movies and want to get recommendations for what to watch next, but aren’t sure where to look. In this project, you’ll use your knowledge of HTTP requests and asynchronous JavaScript to create a movie discovery app that will recommend random movies by genre. You’ll be able to choose from several genres, and like or dislike a movie to get another suggestion.
// Добавление функционала для отображения списка понравившихся и не понравившихся фильмов:
// Нужно создать массивы для хранения этих фильмов и добавить функционал для их отображения.

// Обновление функции getMovies, чтобы случайная страница была выбрана вместо первой страницы:
// Добавим параметр для случайного выбора страницы в API запросе.

// Расширение функции displayMovie, чтобы включить информацию о актерах и дате выпуска.

// Исправлены синтаксические ошибки.
// Добавлен функционал для хранения и отображения понравившихся и не понравившихся фильмов.
// Обновлена функция getMovies, чтобы включить выбор случайной страницы.
// Расширена функция displayMovie, чтобы включить информацию о актерах и дате выпуска.

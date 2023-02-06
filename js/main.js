'use strict';

const url = 'https://exciting-troubled-ring.glitch.me/movies';
const movieDBUrl = "https://api.themoviedb.org/3";
const movieImageBaseUrl = "https://image.tmdb.org/t/p/w200";
const myModal = new bootstrap.Modal(document.getElementById('modal-message'));
const moviesPerCarousel = 4;
let movies = [];
let editingCardId = null;
let carouselId = 0;


function fetchMoviePoster(search) {
	return fetch(movieDBUrl + "/search/movie?api_key=" + MOVIE_DB_API_KEY + "&query=" + encodeURIComponent(search))
		.then(function (res) {
			if (res.ok) {
				return res.json()
			} else {
				return Promise.reject()
			}
		})
		.then(data => data.results[0].poster_path).catch(function (error) {
			console.log(error)
		});
}

function fetchMovies() {
	return fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				return Promise.reject()
			}
		})
		.then(data => data).catch(function (error) {
			$('#error-msg').removeClass('d-none')
			return console.log('error');
		});
}

async function buildMovieCarouselHTML() {
	movies = await fetchMovies();
	let html = '';
	for (let i = 0; i < movies.length; i++) {
		if (i === 0) {
			html += `<div data-carousel-id="${i}" class="carousel-item ${carouselId === i ? 'active' : ''}"><div class="d-flex justify-content-around align-items-center movie-carousels">`
		}
		if (i % moviesPerCarousel === 0 && i !== 0) {
			html += `</div></div><div data-carousel-id="${i}" class="carousel-item ${carouselId === i ? 'active' : ''}"><div class="d-flex justify-content-around align-items-center movie-carousels">`
		}
		html += await makeCards(movies[i]);
	}
	// html += ``
	return html;
}

async function makeCards({id, name, description, rating, img}) {
	let moviePosterUrl = await fetchMoviePoster(name);
	if(moviePosterUrl === undefined){
	moviePosterUrl = '/ljIwC5VyEu97IsE58MTQzoUOlhq.jpg'
	}
	return `<div data-id="${id}" class="movie-card-container text-light">
            <div class="card movie-card">
                <img src="${movieImageBaseUrl + moviePosterUrl}" class="card-img">
                <div class="card-img-overlay bg-dark bg-opacity-50 d-none">
                <button class="position-absolute btn-danger btn btn-delete " style="font-size: 12px; top: 0px; right: 5px;"><i class="fa-solid fa-x"></i></button>
                <button class="edit-movie btn-dark btn position-absolute" style="bottom: 0px; right: 0px;">Edit</button>
                    <p class="card-text text-wrap py-5" style="height: 70%;">${description}</p>
                    <h5 class="card-title text-wrap text-center">${name}</h5>
                    <span>Average Rating: ${rating}</span>
                </div>
            </div>
        </div>`;
}

function fillForm() {
	movies.filter(function (movie) {
		if (movie.id === editingCardId) {
			$('#edit-movie-name').val(movie.name)
			$('#edit-movie-description').val(movie.description)
			$('#edit-movie-rating').val(movie.rating)
		}
	});
}


function sendToMoviesDatabase(name, description, rating, method, id = false) {
	let urlId = ''
	if (id) {
		urlId = '/' + id
	}
	return fetch(url + urlId, {
		method: method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			description: description,
			rating: rating
		})
	});
}

async function addMovie() {
	let movieName = $('#add-movie-name').val()
	let movieDescription = $('#add-movie-description').val()
	let movieRating = $('#select-movie-rating').val()
	// let filteredArray = movies.filter(movie => movie.name === movieName)
	if (movieName === '') {
		$('#modal-error-msg').text('Please add Movie Name')
		return myModal.show();
	}
	if (movies.filter(movie => movie.name === movieName).length !== 0) {
		$('#modal-error-msg').text('This name already exists')
		return myModal.show();
	}
	await sendToMoviesDatabase(movieName, movieDescription, movieRating, 'POST').then(function (res) {
		if (res.ok) {
			refreshAndRenderMovieList();
		} else {
			return Promise.reject();
		}
	}).catch(function (err) {
		$('#content-main').addClass('d-none')
		$('#error-msg').removeClass('d-none')
		return console.log('error');
	})
}


function deleteMovie(id) {
	return fetch(url + '/' + id, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
	}).then(function (res) {
		if (res.ok) {
			refreshAndRenderMovieList();
		} else {
			return Promise.reject();
		}
	})
}

async function editMovie() {
	let movieName = $('#edit-movie-name').val()
	let movieDescription = $('#edit-movie-description').val()
	let movieRating = $('#edit-movie-rating').val()
	await sendToMoviesDatabase(movieName, movieDescription, movieRating, 'PATCH', editingCardId).then(function (res) {
		if (res.ok) {
			refreshAndRenderMovieList();
		} else {
			return Promise.reject();
		}
	}).catch(function (err) {
		$('#content-main').addClass('d-none')
		$('#error-msg').removeClass('d-none')
		return console.log('error');
	})
}


function refreshAndRenderMovieList() {
	buildMovieCarouselHTML()
		.then(function (response) {
			$('#movie-list-content').html(response)
			$('#loading').addClass('d-none')
			$('#content-main').removeClass('d-none')
			$('.edit-movie').each(function () {
				$(this).click(function () {
					if (editingCardId === null) {
						$('#edit-movie').toggleClass('d-none');
					} else if (editingCardId === parseInt($(this).closest('div.movie-card-container').attr('data-id'))) {
						editingCardId = null;
						$('#edit-movie').toggleClass('d-none');
						return
					}
					editingCardId = parseInt($(this).closest('div.movie-card-container').attr('data-id'));
					// $('#edit-movie').toggleClass('d-none');
					fillForm();
				});
			});
			$('.btn-delete').each(function () {
				$(this).click(function () {
					let datumId = $(this).closest('div.movie-card-container').attr('data-id')
					deleteMovie(datumId).then(function () {
						if(editingCardId === parseInt(datumId) && !($('#edit-movie').hasClass('d-none'))){
							$('#edit-movie').toggleClass('d-none');
							editingCardId = null;
						}
						if(movies.length === 1){
							$('#movie-list').toggleClass('d-none')
						} else if (movies.length % moviesPerCarousel === 1 && $('#movie-list-content').children().last().hasClass('active')) {
							carouselId = parseInt($('.active').first().attr('data-carousel-id')) - moviesPerCarousel
						} else {
							carouselId = parseInt($('.active').first().attr('data-carousel-id'))
						}
						refreshAndRenderMovieList()
					}).catch(function (err) {
						$('#content-main').addClass('d-none')
						$('#error-msg').removeClass('d-none')
						return console.log('error');
					})
				});
			})
			$('.movie-card-container').each(function () {
					$(this).hover(function (){
						$(this).children().children('.card-img-overlay').toggleClass('d-none');
					}, function () {
						$(this).children().children('.card-img-overlay').toggleClass('d-none')
					})
				});
		}).finally(function () {
		$('#loading').addClass('d-none')
	});
}

$('#add-movie-form').submit(function(e){
	e.preventDefault();
});
$('#edit-movie-form').submit(function(e){
	e.preventDefault();
});

$('#create-movie-btn').click(async function () {
	if (movies.length % moviesPerCarousel === 0) {
		carouselId = movies.length
	} else {
		carouselId = Math.floor(movies.length / moviesPerCarousel) * moviesPerCarousel
	}
	await addMovie();
	if($('#movie-list').hasClass('d-none')){
		$('#movie-list').toggleClass('d-none')
	}
	$('#add-movie-name').val('')
	$('#add-movie-description').val('')
	$('#select-movie-rating').val('5')
})
$('#edit-movie-btn').click(async function () {
	carouselId = parseInt($('.active').first().attr('data-carousel-id'))
	await editMovie();
	// $('#edit-movie-name').val('')
	// $('#edit-movie-description').val('')
	// $('#edit-movie-rating').val('')
})

function findCard(search) {
	let matchedSearches = movies.filter(function (movie) {
		return movie.name.toLowerCase().includes(search)
	});
	if (matchedSearches.length === 0) {
		$('#modal-error-msg').text('No matches for that search.')
		myModal.show();
		return
	}
	let matchSearch = matchedSearches[0].id

	$('.active').removeClass('active')
	$(`[data-id='${matchSearch}']`).addClass('animate__fadeOut').attr(
		'style', 'border: yellow solid 3px !important'
	).parent().parent().addClass('active')

	setTimeout(function() {
		$(`[data-id='${matchSearch}']`).removeClass('highlight');
	}, 3000);
}

$('#movie-search-form').submit(function (e) {
	e.preventDefault();
	let search = $('#movie-search-bar').val().toLowerCase()
	findCard(search);
});

refreshAndRenderMovieList();
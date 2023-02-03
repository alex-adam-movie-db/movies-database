'use strict';

const url = 'https://exciting-troubled-ring.glitch.me/movies';
let movies = [];
let editingCardId = null;

function fetchMovies () {
    return fetch(url)
        .then(response => response.json())
        .then(data => data);
}

async function buildMovieCarouselHTML () {
    movies = await fetchMovies();
    let html = '';
    for (let i = 0; i < movies.length; i++) {
        if(i === 0){
            html += `<div class="carousel-item active "><div class="d-flex justify-content-around align-items-center movie-carousels">`
        }
        if(i % 4 === 0 && i !== 0){
            html += `</div></div><div class="carousel-item"><div class="d-flex justify-content-around align-items-center movie-carousels">`
        }
        html += makeCards(movies[i]);
    }
    // html += ``
    return html;
}

function makeCards({id, name, description, rating, img}){
    return `<div data-id="${id}" class="movie-card-container">
            <div class="card movie-card">
                <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" class="card-img-top"></a>
                <div class="card-body">
                    <h5 class="card-title text-wrap text-center">${name}</h5>
                    <p class="card-text text-wrap">${description}</p>
                    <span>Average Rating: ${rating}</span>
                    <button class="edit-movie btn-dark btn">Edit</button>
                </div>
            </div>
        </div>`;
}

function fillForm() {

}

function sendToMoviesDatabase(name, description, rating, method) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            rating: rating
        })
    })
    //     .then(function () {
    //     return buildMovieCarouselHTML();
    // }).then(function (data) {
    //     $('#movie-list').html(data)
    // });
}

async function addMovie () {
    let movieName = $('#add-movie-name').val()
    let movieDescription = $('#add-movie-description').val()
    let movieRating = $('#select-movie-rating').val()
    // let filteredArray = movies.filter(movie => movie.name === movieName)
    if (movieName === ''){
        return alert('Insert Movie Name')
    }
    if (movies.filter(movie => movie.name === movieName).length !== 0){
        return alert('Duplicate Movie Name')
    }
    await sendToMoviesDatabase(movieName, movieDescription, movieRating, 'POST');
    refreshAndRenderMovieList();
}

async function editMovie () {
    let movieName = $('#edit-movie-name').val()
    // if(movieName === ''){
    //     return alert('Insert Movie Name')
    // }
    let movieDescription = $('#edit-movie-description').val()
    let movieRating = $('#edit-movie-rating').val()
    // let filteredArray = movies.filter(function(movie) {
    //     return movie.name === movieName
    // })
    // if (filteredArray.length !== 0){
    //     return alert('Duplicate Movie Name')
    // }
    await sendToMoviesDatabase(movieName, movieDescription, movieRating, 'PATCH');
    refreshAndRenderMovieList();
}

function refreshAndRenderMovieList() {
    buildMovieCarouselHTML()
        .then(function (response) {
        $('#movie-list-content').html(response)
        $('.edit-movie').each(function () {
            $(this).click(function () {
                if (editingCardId === null) {
                    $('#edit-movie').toggleClass('d-none');
                } else if (editingCardId === $(this).closest('div.movie-card-container').attr('data-id')) {
                    editingCardId = null;
                    $('#edit-movie').toggleClass('d-none');
                    return
                }
                editingCardId = $(this).closest('div.movie-card-container').attr('data-id');
                // $('#edit-movie').toggleClass('d-none');
                fillForm();
            });
        });
    });
}

$('#movie-search-form').submit(e => e.preventDefault());
$('#create-movie-btn').click(async function () {
    await addMovie();
    $('#add-movie-name').val('')
    $('#add-movie-description').val('')
    $('#select-movie-rating').val('')
})
$('#edit-movie-btn').click(async function () {
    await editMovie();
    $('#edit-movie-name').val('')
    $('#edit-movie-description').val('')
    $('#edit-movie-rating').val('')
})

refreshAndRenderMovieList();
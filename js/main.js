'use strict';

let url = 'https://exciting-troubled-ring.glitch.me/movies';

let movies = ''

function fetchMovies () {
    return fetch('https://exciting-troubled-ring.glitch.me/movies')
        .then(response => response.json())
        .then(data => data);
}

async function renderMoviesList () {
    movies = await fetchMovies();
    let html = '<div id="carouselExampleControls" class="carousel bg-dark slide" data-bs-interval="false"><div class="carousel-inner">';
    for (let i = 0; i < movies.length; i++) {
        if(i === 0){
            html += `<div class="carousel-item active "><div class="d-flex justify-content-around align-items-center movie-carousels">`
        }
        if(i % 4 === 0 && i !== 0){
            html += `</div></div><div class="carousel-item"><div class="d-flex justify-content-around align-items-center movie-carousels">`
        }
        html += makeCards(movies[i]);
    }
    html += `</div></div></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>`
    $('.edit-movie').each( function(){
        $(this).click(function() {
            $('#edit-movie').toggleClass('d-none')
            // fillForm();
            console.log('hello')
        });
    });
    return html;
}

function makeCards({id, name, description, rating, img}){
    return `<div data-id="${id}" class="">
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

$('#movie-search-form').submit(e => e.preventDefault());

renderMoviesList().then(function(response) {
    $('#movie-list').html(response)
});

$('#create-movie-btn').click(function () {
    addMovie();
    $('#add-movie-name').val('')
    $('#add-movie-description').val('')
    $('#select-movie-rating').val('')
})

function addMovie () {
    let movieName = $('#add-movie-name').val()
    if(movieName === ''){
        return alert('Insert Movie Name')
    }
    let movieDescription = $('#add-movie-description').val()
    let movieRating = $('#select-movie-rating').val()
    let filteredArray = movies.filter(function(movie) {
        return movie.name === movieName
    })
    if (filteredArray.length !== 0){
        return alert('Duplicate Movie Name')
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: movieName,
            description: movieDescription,
            rating: movieRating
        })
    }).then(function () {
        return renderMoviesList();
    }).then(function(data) {
        $('#movie-list').html(data)
    });
}

$('#edit-movie-btn').click(function () {
    editMovie();
    $('#edit-movie-name').val('')
    $('#edit-movie-description').val('')
    $('#edit-movie-rating').val('')
})
function editMovie () {
    let movieName = $('#edit-movie-name').val()
    if(movieName === ''){
        return alert('Insert Movie Name')
    }
    let movieDescription = $('#edit-movie-description').val()
    let movieRating = $('#edit-movie-rating').val()
    // let filteredArray = movies.filter(function(movie) {
    //     return movie.name === movieName
    // })
    // if (filteredArray.length !== 0){
    //     return alert('Duplicate Movie Name')
    // }
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: movieName,
            description: movieDescription,
            rating: movieRating
        })
    }).then(function () {
        return renderMoviesList();
    }).then(function(data) {
        $('#movie-list').html(data)
    });
}
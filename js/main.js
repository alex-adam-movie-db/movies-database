'use strict';

function fetchMovies () {
    return fetch('https://exciting-troubled-ring.glitch.me/movies')
        .then(response => response.json())
        .then(data => data);
}

async function renderMoviesList () {
    const movies = await fetchMovies();
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
    return html;
}

function makeCards({id, name, description, rating, img}){
    return `<div data-id="${id}" class="">
            <div class="card movie-card">
                <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" class="card-img-top"></a>
                <div class="card-body">
                    <h5 class="card-title text-wrap text-center">${name}</h5>
                    <p class="card-text text-wrap">${description}</p>
                    <span>Average Rating: ${rating.avg_rating}</span>
                </div>
            </div>
        </div>`;
}

$('#movie-search-form').submit(e => e.preventDefault());

renderMoviesList().then(function(response) {
    $('#movie-list').html(response)
});
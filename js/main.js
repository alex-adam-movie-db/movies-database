'use strict';

function fetchMovies () {
    return fetch('https://exciting-troubled-ring.glitch.me/movies')
        .then(response => response.json())
        .then(data => data);
}

async function renderMoviesList () {
    const movies = await fetchMovies();
    let html = '';
    for (const movie of movies) {
        html += makeCards(movie);
    }
    return html;
}

function makeCards({id, name, description, rating, img}){
    return `<div data-id="${id}" class="col">
            <div class="card h-100">
                <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" class="card-img-top"></a>
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${description}</p>
                    <span>${rating}</span>
                </div>
            </div>
        </div>`;
}
renderMoviesList().then(function(response) {
    $('movie-list').html(response)
})
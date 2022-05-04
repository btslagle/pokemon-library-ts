"use strict";
exports.__esModule = true;
var pokemonListing = document.querySelector("#pokemon-listing");
var spinner = document.querySelector(".spinner");
function addPokemonImage(pokemon) {
    var div = document.createElement("div");
    if (pokemonListing) {
        div.innerHTML = "\n        <figure>\n        <img src =\"".concat(pokemon.sprites.front_default, "\"").concat(pokemon.name, "\" />\n        <figcaption><a href=\"pokemon.html?pokemon=").concat(pokemon.name, "\">").concat(pokemon.name, "</a></figcaption> \n        </figure>\n        ");
        pokemonListing.append(div);
    }
}
var url = "https://pokeapi.co/api/v2/pokemon?limit=50&offset=400";
fetch(url)
    .then(parsedJson)
    .then(function (parsedResponse) {
    var urls = parsedResponse.results.map(function (result) { return result.url; });
    var fetches = urls.map(function (url) { return fetch(url).then(function (response) { return response.json(); }); });
    return Promise.all(fetches);
}).then(function (responses) {
    if (spinner) {
        spinner.classList.add("hidden");
    }
    responses.forEach(function (response) {
        addPokemonImage(response);
    });
})["catch"](function (error) {
    var $p = document.createElement('p');
    if (pokemonListing) {
        $p.textContent = "Something went wrong!";
        pokemonListing.append($p);
    }
});
function parsedJson(response) {
    return response.json();
}

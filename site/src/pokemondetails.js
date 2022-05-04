"use strict";
exports.__esModule = true;
var $pokemon = document.querySelector("#pokemon-details");
var $spinner = document.querySelector(".spinner");
var ul = document.querySelector(".abilities");
function addPokemonImage(pokemon) {
    if ($pokemon) {
        var div = document.createElement("div");
        div.innerHTML = "\n            <figure>\n                <img src=\"".concat(pokemon.sprites.front_default, "\" alt=\"").concat(pokemon.name, "\" />\n                <figcaption>").concat(pokemon.name, "</figcaption>\n            </figure>\n        ");
        $pokemon.append(div);
    }
}
function addPokemonAbilities(pokemon) {
    var _a;
    if (ul) {
        var li = document.createElement("li");
        var flavor_text = pokemon.flavor_text_entries.find(function (flavor_text_entry) {
            return flavor_text_entry.language.name === "en";
        });
        li.innerHTML = "\n        <span class=\"ability-name\">".concat(pokemon.name, "</span>\n        <br>\n        <span class=\"ability-short-description\">").concat((_a = flavor_text === null || flavor_text === void 0 ? void 0 : flavor_text.flavor_text) !== null && _a !== void 0 ? _a : "", "</span>\n        ");
        ul.append(li);
    }
}
function parsedJson(response) {
    return response.json();
}
var queryString = new URLSearchParams(window.location.search);
fetch("https://pokeapi.co/api/v2/pokemon/".concat(queryString.get("pokemon")))
    .then(parsedJson)
    .then(function (response) {
    addPokemonImage(response);
    var abilitiesRequests = response.abilities
        .map(function (response) { return response.ability.url; })
        .map(function (url) {
        console.log(queryString.get("pokemon"));
        return fetch(url).then(function (response) { return response.json(); });
    });
    return Promise.all(abilitiesRequests);
})
    .then(function (parsedResponses) {
    var urls = parsedResponses.flatMap(function (parsedResponse) { return parsedResponse.flavor_text_entries
        .map(function (flavor_text_entry) { return flavor_text_entry.url; }); });
    var fetches = urls.map(function (url) {
        return fetch(url).then(function (response) { return response.json(); });
    });
    return Promise.all(fetches);
})
    .then(function (responses) {
    if ($spinner) {
        $spinner.classList.add("hidden");
    }
    responses.forEach(function (pokemon) {
        addPokemonAbilities(pokemon);
    });
})["catch"](function (error) {
    var $p = document.createElement("p");
    if ($pokemon) {
        $p.textContent = "Something went wrong!";
        $pokemon.append($p);
    }
});

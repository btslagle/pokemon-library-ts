import { string } from "yargs"

const pokemonListing = document.querySelector<HTMLDivElement>("#pokemon-listing")
const spinner = document.querySelector(".spinner")

type Error = {
    error: string;
}

type Pokemon = {
    name: string;
    sprites: {
        front_default: string;
    };


};

type Url = {
    url: string
}

type Result = {
    url: string
}



function addPokemonImage(pokemon: Pokemon) {
    const div = document.createElement("div")
    if (pokemonListing) {
        div.innerHTML = `
        <figure>
        <img src ="${pokemon.sprites.front_default}"${pokemon.name}" />
        <figcaption><a href="pokemon.html?pokemon=${pokemon.name}">${pokemon.name}</a></figcaption> 
        </figure>
        `

        pokemonListing.append(div)
    }
}


let url = "https://pokeapi.co/api/v2/pokemon?limit=50&offset=400"
fetch(url)
    .then(parsedJson)
    .then(parsedResponse => {
        const urls = parsedResponse.results.map((result: Result) => result.url)
        const fetches = urls.map((url: string) => fetch(url).then(response => response.json()))
        return Promise.all(fetches)
    }).then(responses => {
        if (spinner) {
            spinner.classList.add("hidden")
        }
        responses.forEach(response => {
            addPokemonImage(response)
        })

    }).catch((error: Error) => {
        const $p = document.createElement('p');
        if (pokemonListing) {
            $p.textContent = "Something went wrong!";
            pokemonListing.append($p);
        }
    })

function parsedJson(response: Response) {
    return response.json()
}


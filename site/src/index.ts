import { string } from "yargs"

const pokemonListing = document.querySelector<HTMLDivElement>("#pokemon-listing")
const spinner = document.querySelector(".spinner")

type Error= {
    error: string;
}

type Pokemon = {
    name: string;
    sprites: {
        front_default: string;
    };
    
    
};

type Url = {
    url: string;
}

function addPokemonImage(pokemon:Pokemon) {
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
        const urls = parsedResponse.results.map(result => result.url)
        const fetches = urls.map(url => fetch(url).then(response => response.json()))
        return Promise.all(fetches)
    }).then(responses => {
        if (spinner) {
        spinner.classList.add("hidden")
    }
        responses.forEach(response => {
                addPokemonImage(response)
            })
            .catch((error) => {
                const message = (error instanceof Error)
                ? error.message
                : "Unknown error"
                console.error(message)
            })
                const $p = document.createElement('p');
                if(pokemonListing){
                $p.textContent = "Something went wrong!";
                pokemonListing.append($p);
                }
            })
    function parsedJson(response:Response) {
        
            return response.json()
    }

    type PokemonResponse = {
        data?: {
          pokemon: Pokemon
        }
        errors?: { message: string }[]
      }

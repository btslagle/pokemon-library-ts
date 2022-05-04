import { SignatureHelpRetriggeredReason } from "typescript";

const $pokemon = document.querySelector<HTMLDivElement>("#pokemon-details");
const $spinner = document.querySelector<HTMLImageElement>(".spinner");
const ul = document.querySelector<HTMLUListElement>("ul");

type Pokemon = {
  name: string;
  sprites: {
    front_default: string;
  };
  ability: Ability;
  flavor_text_entries: FlavorText[];
  language: string;
};

type FlavorText = {
  language: {
    name: string;
  };
  flavor_text: string;
  url:string;
};

type Ability = {
  url: string;
  ability: string;
};

type Url = {
  url: string;
};

type Result = {
  url: string;
  ability: string;
};

type AbilityResponse = {
    flavor_text_entries: FlavorText[];

}
function addPokemonImage(pokemon: Pokemon) {
  if ($pokemon) {
    const div = document.createElement("div");
    div.innerHTML = `
            <figure>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
                <figcaption>${pokemon.name}</figcaption>
            </figure>
        `;
    $pokemon.append(div);
  }
}
function addPokemonAbilities(pokemon: Pokemon) {
  if (ul) {
    const li = document.createElement("li");
    const flavor_text = pokemon.flavor_text_entries.find(
      (flavor_text_entry) =>
        flavor_text_entry.language.name === "en"
    );
    li.innerHTML = `
        <span class="ability-name">${pokemon.name}</span>
        <br>
        <span class="ability-short-description">${flavor_text?.flavor_text ?? ""}</span>
        `;
    ul.append(li);
  }
}

function parsedJson(response: Response) {
  return response.json();
}

const queryString = new URLSearchParams(window.location.search);
fetch(`https://pokeapi.co/api/v2/pokemon/${queryString.get("pokemon")}`)
  .then(parsedJson)
  .then((response) => {
    addPokemonImage(response);
    const abilitiesRequests = response.abilities
      .map((response: Pokemon) => response.ability.url)
      .map((url: string) => {
        return fetch(url).then((response) => response.json());
      });
    return Promise.all<AbilityResponse[]>(abilitiesRequests);
  })
  .then((parsedResponses) => {
    const urls = parsedResponses.flatMap(parsedResponse => parsedResponse.flavor_text_entries
        .map(flavor_text_entry => flavor_text_entry.url))
    const fetches = urls.map((url: string) =>
      fetch(url).then((response) => response.json())
    );
    return Promise.all<Pokemon>(fetches)
  })
  .then((responses) => {
    if ($spinner) {
      $spinner.classList.add("hidden");
    }
    responses.forEach((flavor_text_entry) => {
      addPokemonAbilities(flavor_text_entry);
    });
  })
  .catch((error: Error) => {
    const $p = document.createElement("p");
    if ($pokemon) {
      $p.textContent = "Something went wrong!";
      $pokemon.append($p);
    }
  });

let peticion;
let datos;
let descripcion;
let correcto = false;

document.addEventListener('DOMContentLoaded', () => {
    cargarEventos();
});

function cargarEventos() {
    document.getElementById('boton').addEventListener('click', (event) => {
        event.preventDefault();
        ajax();
    });
}

function ajax() {  
    let pokemonNumber = document.getElementById('pokemonNumber').value;
    let pokemonName = document.getElementById('pokemonName').value;
    let url = pokemonNumber ? `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}` : `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

    console.log(pokemonName);
    console.log(pokemonNumber);

    peticion = new XMLHttpRequest();
    movidas('GET', url, true);
    peticion.onreadystatechange = mostrar;
}

function movidas (get, url, boolean) {
    console.log(url);
    peticion.open(get, url, boolean);
    peticion.send();    
}

function mostrar () {
    if (peticion.readyState === 4 && peticion.status === 200) {
        datos = JSON.parse(peticion.responseText);
        procesar();
        console.log(datos);
    }
}

function procesar() {
    let nombree = datos.name.charAt(0).toUpperCase() + datos.name.slice(1);
    let numeroo = datos.id;
    let habilidades = datos.abilities.map(habilidad => habilidad.ability.name).join(', ');
    let sprite = datos.sprites.other['official-artwork'].front_default;
    let ataques = datos.moves.map(ataque => ataque.move.name).join(', ');
    let altura = datos.height;

    altura = altura / 10;
    let peso = datos.weight;
    peso = peso / 10;

    let tipo = datos.types.map(tipo => {
        switch (tipo.type.name) {
            case 'normal': return 'Normal';
            case 'fighting': return 'Lucha';
            case 'flying': return 'Volador';
            case 'poison': return 'Veneno';
            case 'ground': return 'Tierra';
            case 'rock': return 'Roca';
            case 'bug': return 'Bicho';
            case 'ghost': return 'Fantasma';
            case 'steel': return 'Acero';
            case 'fire': return 'Fuego';
            case 'water': return 'Agua';
            case 'grass': return 'Planta';
            case 'electric': return 'Eléctrico';
            case 'psychic': return 'Psíquico';
            case 'ice': return 'Hielo';
            case 'dragon': return 'Dragón';
            case 'dark': return 'Siniestro';
            case 'fairy': return 'Hada';
            default: return tipo.type.name.charAt(0).toUpperCase() + tipo.type.name.slice(1);
        }
    }).join(', ');

    let speciesUrl = datos.species.url;

    // Make another AJAX call to get the species data
    let speciesRequest = new XMLHttpRequest();
    speciesRequest.open('GET', speciesUrl, true);
    speciesRequest.onreadystatechange = function() {
        if (speciesRequest.readyState === 4 && speciesRequest.status === 200) {
            let speciesData = JSON.parse(speciesRequest.responseText);
            console.log(speciesData);
            let descripcion = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;

            // Translate abilities to Spanish
            let abilitiesRequests = datos.abilities.map(habilidad => {
                return new Promise((resolve, reject) => {
                    let abilityRequest = new XMLHttpRequest();
                    abilityRequest.open('GET', habilidad.ability.url, true);
                    abilityRequest.onreadystatechange = function() {
                        if (abilityRequest.readyState === 4 && abilityRequest.status === 200) {
                            let abilityData = JSON.parse(abilityRequest.responseText);
                            let abilityName = abilityData.names.find(name => name.language.name === 'es').name;
                            console.log(abilityData);
                            resolve(abilityName);
                        }
                    };
                    
                    abilityRequest.send();
                });
            });

           

            Promise.all(abilitiesRequests).then(abilitiesInSpanish => {
                let habilidadesEnEspanol = abilitiesInSpanish.join(', ');

                nombre.innerHTML = `
                    <h1>${nombree}</h1>
                `;
                numero.innerHTML = `
                    <h1>${numeroo}</h1>
                `;
                foto.innerHTML = `
                    <img src="${sprite}" alt="${nombree}">
                `;
                iDhabilidades.innerHTML = `
                    ${habilidadesEnEspanol}                   
                `;
                iDdescripcion.innerHTML = `
                    ${descripcion}
                `;
                iDaltura.innerHTML = `
                    ${altura} m
                `;
                iDpeso.innerHTML = `
                    ${peso} kg
                `;
                iDtipo.innerHTML = `
                    ${tipo}
                `;
            });
        }
    };
    speciesRequest.send();
    borrarCampos();
}

function borrarCampos() {
    document.getElementById('pokemonNumber').value = '';
    document.getElementById('pokemonName').value = '';
}


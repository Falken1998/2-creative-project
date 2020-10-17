document.getElementById("pokeSearchBarSubmitOne").addEventListener("click", function (event) {
    value = document.getElementById("pokeSearchBarOne").value
    event.preventDefault();
    console.log("search button Clicked!!!")
    getPokemonInfo(value, `https://pokeapi.co/api/v2/pokemon/${value}/`)
});

function getPokemonInfo(value, url, barNumber) {
    if (value === '') {
        return;
    }
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (json) {
        getSuggestions(barNumber, true);
        buildCard(json);
    }).catch(() => {
        document.getElementById("txtHint" + barNumber).innerHTML = 'Please Enter a Valid Pokemon name';
    })
}

function getSuggestions(barNumber, found) {
    let pokeArray;
    console.log(document.getElementById("pokeSearchBar" + barNumber).value)
    if (document.getElementById("pokeSearchBar" + barNumber).value === '') {
        document.getElementById("txtHint" + barNumber).innerHTML = '<br>';
    }
    const url = "pokemon.json";
    fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            pokeArray = json;
        }).then(function () {
            if (found) {
                document.getElementById("txtHint" + barNumber).innerHTML = '';
                return
            }
            let arr = filterValuePart(pokeArray, document.getElementById("pokeSearchBar" + barNumber).value.replace(/\s/g, '-'))
            if (arr.length < 20) {
                var everything;
                everything = "<ul>";
                const promises = [];
                for (let i = 0; i < arr.length; i++) {
                    var tempArr;
                    promises.push(fetch(arr[i].url).then((response) => {
                        return response.json();
                    }).then((json) => {
                        tempArr = json;
                    }).then(() => {
                        let img;
                        img = tempArr.sprites.front_default;
                        if (img === null) {
                            img = '/master-ball.png'
                        }
                        everything += "<li class='box p-0 px-2'><div class='level'><div class='level-left'> <a onclick='insert(this)' class='level-item title is-5' id='" + barNumber + "'>" + arr[i].name + "</a></div>";
                        everything += "<div class='level-right'> <div class='level-item'> <img class='image is-64x64' src='" + img + "'></div></div>"
                    })
                    )
                };
                Promise.all(promises)
                    .then((results) => {
                        everything += "</ul>";
                        document.getElementById("txtHint" + barNumber).innerHTML = everything;
                    })

            }
        });

}
function insert(element) {
    let value = element.innerHTML.toLowerCase();
    document.getElementById("pokeSearchBar" + element.id).value = element.innerHTML;
    getSuggestions(element.id, true)
    getPokemonInfo(value, `https://pokeapi.co/api/v2/pokemon/${value}/`, 'One')
    
}
function filterValuePart(arr, part) {
    part = part.toLowerCase();

    return arr.filter(function (obj) {
        return Object.keys(obj)
            .some(function (k) {
                return obj[k].toLowerCase().indexOf(part) !== -1;
            });
    });
};

function buildCard(json) {
    let doc = document;
    doc.getElementById("pokemonName").innerHTML = upperFirstLetter(json.name);
    doc.getElementById("height").innerHTML = `Height: ${(json.height * 0.328084).toFixed(1)}ft`
    doc.getElementById("weight").innerHTML = `Weight: ${(json.weight * 0.220462).toFixed(1)}lbs`;
    doc.getElementById("type").innerHTML = `Type: ${upperFirstLetter(json.types[0].type.name)}`;
    let img;
    img = json.sprites.front_default;
    if (img === null) {
        img = '/master-ball.png'
    }
    doc.getElementById("icon").innerHTML = "<img class='image is-128x128' src='" + img + "'>";
    let abil = doc.getElementById("abilities");
    var stuff = "<hr><li class='pt-2' style='font-weight:500;font-style:bold;'> Abilities: </li>";
    for (i = 0; i < json.abilities.length; i++) {
        stuff += "<li>" + json.abilities[i].ability.name
    }
    abil.innerHTML = stuff;

    let statObj = doc.getElementById("stats");
    stuff = "<hr><li class='pt-2' style='font-weight:500;font-style:bold;'> Stats: </li>";
    for (i = 0; i < json.stats.length; i++) {
        stuff += `<li> ${json.stats[i].stat.name}: ${json.stats[i].base_stat}`
    }
    statObj.innerHTML = stuff;


    doc.getElementById("pokeCard").style = 'visibility: visible !important;'
}
function upperFirstLetter(value) {
    let arr = value.split('-')
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        arr[i] = element.charAt(0).toUpperCase() + element.slice(1);
    }
    return arr.join(' ');
}
document.getElementById("pokeSearchBarSubmitOne").addEventListener("click", function (event) {
    value = document.getElementById("pokeSearchBarOne").value
    event.preventDefault();
    getPokemonInfo(value, `https://pokeapi.co/api/v2/pokemon/${value}/`)
});

function getPokemonInfo(value, url) {
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
    })
}

function getSuggestions() {
    document.getElementById("cityField").addEventListener("keyup", function (event) {
        event.preventDefault();
        if(document.getElementById("cityField").value === ''){
          document.getElementById("txtHint").innerHTML = '<br>';
        }
        const url = "pokemon.json";
        fetch(url)
          .then(function (response) {
            return response.json();
          }).then(function (json) {
            pokeArray = json;
          }).then(function () {
            let arr = filterValuePart(pokeArray, document.getElementById("cityField").value)
            if (arr.length < 10) {
              var everything;
              everything = "<ul>";
              for (let i = 0; i < arr.length; i++) {
                everything += "<li> " + arr[i].name;
              };
              everything += "</ul>";
              document.getElementById("txtHint").innerHTML = everything;
            }
          });
      });
    
      function filterValuePart(arr, part) {
        part = part.toLowerCase();
    
        return arr.filter(function (obj) {
          return Object.keys(obj)
            .some(function (k) {
              return obj[k].toLowerCase().indexOf(part) !== -1;
            });
        });
      };
}
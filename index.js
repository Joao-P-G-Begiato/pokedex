async function btnClick(){
    const pkmn = document.getElementById("input-pkmn").value
    const requestedPokemon = await pokemonRequest(pkmn)
    writePokeInfo(requestedPokemon)
}

async function pokemonRequest(pokemon){
    pokemon = pokemon.toLowerCase()
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`

    try{
        const req = await fetch(url)
        .then(
            response => response.json()
        )
        return req
    }catch(e){
        alert("pokemon not found")
    }
}

function writePokeInfo(pokemon){
    const name = pokemon.name.toUpperCase()
    const ref = ["0", "0", "0", "0"]
    const pokemonId = pokemon.id.toString().split("")
    pokemonId.map((element) => {
        ref.shift()
        ref.push(element)
    })
    const number =  ref.join("")
    $(".pokemonName").html(`${name} #${number}`);
    $(".pokemonImage").prop("src", pokemon.sprites.other['official-artwork'].front_default);
    $("#pokemonImage").prop("src", pokemon.sprites.other['official-artwork'].front_shiny);
    const pokemonTypes = pokemon.types
    if(pokemonTypes.length > 1){
        const type1 = pokemon.types[0].type.name
        const type2 = pokemon.types[1].type.name
        $(".pokmeonTypes").html(
            `
            <h3 class="${type1+" "+"type"}"> ${type1} </h3>
            <h3 class="${type2+" "+"type"}"> ${type2} </h3>
            `
        )
    }else{
        const type1 = pokemon.types[0].type.name
        $(".pokmeonTypes").html(
            `<h3 class="${type1+" "+"type"}"> ${type1} </h3>`
        )
    }
    $(".pokmeonAbilities").html(
        pokemon.abilities.map((element)=>{
            return `
            <p>Ability: ${element.ability.name}</p>
            `
        })
    )
    const movesByLevel = pokemon.moves.filter((element) =>{
        if(element.version_group_details[0].move_learn_method.name == "level-up"){
            return element
        }}).map((element) =>{
        return {
            name : element.move.name,
            level : element.version_group_details[0].level_learned_at,
            learnMethod : element.version_group_details[0].move_learn_method.name,
        }
    })

    const movesByTm = pokemon.moves.filter((element) =>{
        if(element.version_group_details[0].move_learn_method.name == "machine"){
            return element
        }}).map((element) =>{
        return {
            name : element.move.name,
            level : element.version_group_details[0].level_learned_at,
            learnMethod : element.version_group_details[0].move_learn_method.name,
        }
    })

    const movesByTutor = pokemon.moves.filter((element) =>{
        if(element.version_group_details[0].move_learn_method.name == "tutor"){
            return element
        }}).map((element) =>{
        return {
            name : element.move.name,
            level : element.version_group_details[0].level_learned_at,
            learnMethod : element.version_group_details[0].move_learn_method.name,
        }
    })

    $("#closeModal").click(function () {
        $("#modalMoveSets").modal("hide")
    }
    )
    const stringMovesByLevel= JSON.stringify(movesByLevel)
    const stringMovesByTm= JSON.stringify(movesByTm)
    const stringMovesByTutor= JSON.stringify(movesByTutor)
    $(".pokmeonAbilities").append(
        `
        <section>
            <button onclick='openmodal(${stringMovesByLevel})' class="moveset" type="button">Level Moves</button>
            <button onclick='openmodal(${stringMovesByTm})' class="moveset" type="button">Machine Moves</button>
            <button onclick='openmodal(${stringMovesByTutor})' class="moveset" type="button">Tutor Moves</button>

        </section>
        `

    )

    $(".pokemonWeight").html(`<strong>Weight:</strong> ${(pokemon.weight/10).toFixed(2)} kilograms`)
    $(".pokemonHeight").html(`<strong>Height:</strong> ${(pokemon.height/10).toFixed(2)} meters`)
    $(".pokemonStats").html(
        `<hr> Base Stats <hr>
        ${pokemon.stats[0].stat.name} : ${pokemon.stats[0].base_stat} <br>
        ${pokemon.stats[1].stat.name} : ${pokemon.stats[1].base_stat} <br> 
        ${pokemon.stats[2].stat.name} : ${pokemon.stats[2].base_stat} <br> 
        ${pokemon.stats[3].stat.name} : ${pokemon.stats[3].base_stat} <br> 
        ${pokemon.stats[4].stat.name} : ${pokemon.stats[4].base_stat} <br> 
        ${pokemon.stats[5].stat.name} : ${pokemon.stats[5].base_stat} <br> 
        `
    )
}

function openmodal(data){
    const order = data[0].learnMethod == "level-up" ? 2 : 0
    tableBuilder(data , order)
    $("#modalMoveSets").modal("show")
}

function tableBuilder(data, order){
    let table
    const pokeData = data
    $("#pokemonMoveSet").dataTable().fnClearTable();
    $("#pokemonMoveSet").dataTable().fnDraw();
    $("#pokemonMoveSet").dataTable().fnDestroy();
    table = $("#pokemonMoveSet").dataTable({
        dom: "Bfrtip",
        responsive: true,
        data: pokeData,
        order: [[order, 'asc']] ,
        columns: [
            {data: "name", width: "60%"},
            {data: "learnMethod"},
            {data: "level"},
        ]
    })
}

$(function () {
    perfil();
    function perfil() { // perfil principal
        $.ajax({
            url: "https://br1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + localStorage.getItem('lolnick') + "?api_key=" + Token, //site da api completa com o nick no local storage + a chave
            method: "GET",
            beforeSend: function () {
                $('#carregando').show();
            },
            success: function (responsePerfil) {
                $('#carregando').hide();
                $('#levelPerfil').html("Level " + responsePerfil.summonerLevel);
                $('#nomePerfil').html(responsePerfil.name);
                $('#iconePerfil').html('<img src="http://ddragon.leagueoflegends.com/cdn/' + version + '/img/profileicon/' + responsePerfil.profileIconId + '.png">');
                tier();
            },
            error: function () {
                console.log('Erro na parte do perfil')
            }
        });
    }
    function tier() { //chamado da api onde mostra os pontos
        $.ajax({
            url: "https://br1.api.riotgames.com/lol/league/v3/positions/by-summoner/" + $(".nome").attr('alt') + "?api_key=" + Token,
            method: "GET",
            success: function (resp) {
                $.each(resp, function (indice, eloPerfil) {
                    $('.main').append(`
                    <div class="eloM">
                            <span class="eloIconeAA"></span>
                            <span class="ranqueado">
                            <span class="queue">${eloPerfil.queueType}</span>
                            </span>
                            <br>
                            <span class="eloAA">${eloPerfil.tier}</span>
                            <span class="posicaoAA">${eloPerfil.rank}</span>
                            <br>
                            <span class="pontosA">PDL ${eloPerfil.leaguePoints}</span>
                            <br>
                            </div>
                `);
                });
                elo();
                imgPersonagem();
            },
            error: function () {
                $('.queuePerfil').append("Sem liga")
            }

        })
    }

    function imgPersonagem() {
        $.ajax({
            url: "https://br1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/" + $(".nome").attr('alt') + "?api_key=" + Token,
            method: "GET",
            async: false,
            beforeSend: function () {
                $('#carregando').show();
            },
            success: function (resp) {
                $.each(resp, function (indice, champ) {
                    $('.main').append('<div id="art"><img src="http://www.stelar7.no/cdragon/latest/uncentered-splash-art/' + champ.championId + '/0.png"></div>');
                    $('#carregando').hide();
                    return false;
                })
            },
            error: function () {
                console.log('Erro na parte de usuario')
            }
        });
    }
    function elo() {
        if ($('.eloAA:eq(0)').html() == "SILVER") { // mostra o icone de acordo com a posição no rank
            $('.eloIconeAA:eq(0)').html('<img src="icon/silver.png">');
        } else if ($('.eloAA:eq(0)').html() == "GOLD") {
            $('.eloIconeAA:eq(0)').html('<img src="icon/gold.png">');
        } else if ($('.eloAA:eq(0)').html() == "BRONZE") {
            $('.eloIconeAA:eq(0)').html('<img src="icon/bronze.png">');
        } else if ($('.eloAA:eq(0)').html() == "diamond") {
            $('.eloIconeAA:eq(0)').html('<img src="icon/diamond.png">');
        } else if ($('.eloAA:eq(0)').html() == "master") {
            $('.eloIconeAA:eq(0)').html('<img src="icon/master.png">');
        } else {
            $('.eloIconeAA:eq(0)').html('<img src="icon/default.png">');
        }

        if ($('.eloAA:eq(1)').html() == "SILVER") { // mostra o icone de acordo com a posição no rank
            $('.eloIconeAA:eq(1)').html('<img src="icon/silver.png">');
        } else if ($('.eloAA:eq(1)').html() == "GOLD") {
            $('.eloIconeAA:eq(1)').html('<img src="icon/gold.png">');
        } else if ($('.eloAA:eq(1)').html() == "BRONZE") {
            $('.eloIconeAA:eq(1)').html('<img src="icon/bronze.png">');
        } else if ($('.eloAA:eq(1)').html() == "diamond") {
            $('.eloIconeAA:eq(1)').html('<img src="icon/diamond.png">');
        } else if ($('.eloAA:eq(1)').html() == "master") {
            $('.eloIconeAA:eq(1)').html('<img src="icon/master.png">');
        } else {
            $('.eloIconeAA:eq(1)').html('<img src="icon/default.png">');
        }

        if ($('.ranqueado:eq(2) span').html() == 'RANKED_SOLO_5x5') {
            $('.ranqueado:eq(2) span').html("Ranqueada Solo")
        } else if
        ($('.ranqueado:eq(2) span').html() == 'RANKED_FLEX_SR') {
            $('.ranqueado:eq(2) span').html("Ranqueada Flex")
        }
        if ($('.ranqueado:eq(1) span').html() == 'RANKED_SOLO_5x5') {
            $('.ranqueado:eq(1) span').html("Ranqueada Solo")
        } else if
        ($('.ranqueado:eq(1) span').html() == 'RANKED_FLEX_SR') {
            $('.ranqueado:eq(1) span').html("Ranqueada Flex")
        }
    }
});
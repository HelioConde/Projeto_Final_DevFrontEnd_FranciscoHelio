$(function () {
    function carregaPaginas(nomeDaPagina) {
        $.ajax({
            url: 'view/' + nomeDaPagina + '.html',
            beforeSend: function () {
                $('#carregando').show();
            },
            success: function (pag) {
                $('#view').html(pag);
                $('#carregando').hide();
            }
        });
    }

    function carregaPaginaAmigos(id) {
        $.ajax({
            url: "https://br1.api.riotgames.com/lol/summoner/v3/summoners/" + id + "?api_key=" + Token,
            method: "GET",
            async: false,
            beforeSend: function () {
                $('#carregando').show();
            },
            success: function (response) {
                $('.main').html('');
                $('.main').append(`
                    <link rel="stylesheet" href="css/amigos.css">
                    <div class="eloP">
                        <span id="IconeAA"><img src="http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${response.profileIconId}.png"></span>
                        <div id="nomeAA">${response.name}</div>
                        <br>
                        <br>
                        <span id="levelAA">Level ${response.summonerLevel}</span>
                `);
            },
            error: function () {
                console.log('Erro na parte de usuario')
            }
        });
    }
    function carregaPaginaElo(id) {
        $.ajax({
            url: "https://br1.api.riotgames.com/lol/league/v3/positions/by-summoner/" + id + "?api_key=" + Token,
            method: "GET",
            beforeSend: function () {
                $('#carregando').show();
            },
            success: function (resp) {
                $.each(resp, function (indice, elo) {
                    $('.main').append(`
                    <div class="eloM">
                            <span class="eloIconeAA"></span>
                            <span class="ranqueado">
                            <span class="queue">${elo.queueType}</span>
                            </span>
                            <br>
                            <span class="eloAA">${elo.tier}</span>
                            <span class="posicaoAA">${elo.rank}</span>
                            <br>
                            <span class="pontosA">PDL ${elo.leaguePoints}</span>
                            <br>
                            </div>
                `);
                });
                elo();
            },
            error: function () {
                console.log('Erro na parte de usuario')
            }
        });
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

            if ($('.ranqueado:eq(0) span').html() == 'RANKED_SOLO_5x5') {
                $('.ranqueado:eq(0) span').html("Ranqueada Solo")
            } else if
            ($('.ranqueado:eq(0) span').html() == 'RANKED_FLEX_SR') {
                $('.ranqueado:eq(0) span').html("Ranqueada Flex")
            }
            if ($('.ranqueado:eq(1) span').html() == 'RANKED_SOLO_5x5') {
                $('.ranqueado:eq(1) span').html("Ranqueada Solo")
            } else if
            ($('.ranqueado:eq(1) span').html() == 'RANKED_FLEX_SR') {
                $('.ranqueado:eq(1) span').html("Ranqueada Flex")
            }
        }
    }
    // 
    function imgPersonagem(id) {
        $.ajax({
            url: "https://br1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/" + id + "?api_key=" + Token,
            method: "GET",
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
    $(document).ready(function () {
        carregaPaginas('home');
    });
    $('#perfil').on(`click`, function () {
        carregaPaginas('perfil');
    });
    $('#home').on(`click`, function () {
        carregaPaginas('home');
    });
    $('#contatos').on(`click`, function () {
        carregaPaginas('contatos');
    });
    $('#galeria').on(`click`, function () {
        carregaPaginas('galeria');
    });
    $('#atualizacoes').on(`click`, function () {
        carregaPaginas('atualizacoes');
    });
    $('.amigos').on(`click`, function () {
        carregaPaginaElo($(this).attr('alt'));
        carregaPaginaAmigos($(this).attr('alt'));
        imgPersonagem($(this).attr('alt'));
    });
});
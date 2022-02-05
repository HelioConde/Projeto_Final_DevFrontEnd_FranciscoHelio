$(function () {
    var tbAmigos;
    var edicao = false;

    function listarContatos() {
        tbAmigos = JSON.parse(localStorage.getItem('tbAmigos')); //ler os amigos
    };
    function amigos() {
        $('#lista table tbody').html(''); //reseta a pagina
        for (obj in tbAmigos) {
            let linha = tbAmigos[obj];// chama amigos pela linha
            $.ajax({
                async: false,
                url: "https://br1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + linha.name + "?api_key=" + Token,
                method: "GET",
                success: function (response) {
                    $('#lista table tbody').append('<td id="iconeA"><a class="amigos" href="#" title="' + response.accountId + '" alt="' + response.id + '"><img src="http://ddragon.leagueoflegends.com/cdn/' + version + '/img/profileicon/' + response.profileIconId + '.png"></a></td>');
                    $('#lista table tbody').append('<td id="friend"><a class="amigos" href="#" title="' + response.accountId + '" alt="' + response.id + '">' + response.name + '</a></td>');
                    $('#lista table tbody').append('<td id="levelA"><a class="amigos" href="#" title="' + response.accountId + '" alt="' + response.id + '">' + "Level " + response.summonerLevel + '</a></td>');
                    $('#lista table tbody').append('<td id="deletarA"><button class="deletar" id="deletar" alt="' + response.id + '"><i class="fas fa-times"></i></button></a></td>');
                    $('#lista table tbody').append('<tr>');
                },
                error: function () {
                    console.log('Erro na parte de usuario')
                }
            });
        };
    };
    //deletar pela id
    function deleta() {
        $('.deletar').on('click', function () {
            let id = $(this).attr('alt');
            $('.dialog').fadeIn('fast', function () {
                $('.ajaxmsg').html(
                    '<strong> Deletar esse amigo? </strong>' +
                    '<button id="sim">Sim</button>' +
                    '<button id="nao">Não</button>'
                ).fadeIn('slow');
                $('#sim').on('click', function () {
                    tbAmigos = JSON.parse(localStorage.getItem('tbAmigos'));
                    for (linha in tbAmigos) {
                        if (tbAmigos[linha].id == id) {
                            tbAmigos.splice(linha, 1);
                        }
                    }
                    localStorage.setItem('tbAmigos', JSON.stringify(tbAmigos));
                    $('.ajaxmsg').html(
                        '<strong> Amigo Deletado com sucesso! </strong>' +
                        '<button id="ok">Ok</button>'
                    ).fadeIn('slow');
                    $('#ok').on('click', function () {
                        $('.dialog').hide();
                        location.reload();
                    });
                });
                $('#nao').on('click', function () {
                    $('.dialog').hide();
                    location.reload();
                });
            });
        });
    };
    listarContatos();
    amigos();
    deleta();
    function consultaApi(nome) {
        var retorno = false;
        $.ajax({
            async: false,
            url: "https://br1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + nome + "?api_key=" + Token,
            method: "GET",
            success: function (response) {
                retorno = response;
            },
            error: function () {
                console.log('Erro na parte de usuario')
            }
        });
        return retorno;
    };

    function cadastrarContatos() { // cadastra no local storage
        let objPessoa = consultaApi($('#add').val());
        let cadastro;
        if (!objPessoa) {
            $('.dialog').fadeIn('fast', function () {
                $('.ajaxmsg').html(
                    '<strong> Amigo não encontrado! </strong>' +
                    '<button id="okNick">Ok</button>'
                ).fadeIn('slow');
                $('#okNick').on('click', function () {
                    $('.ajaxmsg').fadeOut();
                    $('.dialog').fadeOut();
                    amigos();
                    location.reload();
                });
            });
            $('#add').val('');
            return false;
        } else {
            cadastro = objPessoa;
        };
        tbAmigos.push(cadastro);
        localStorage.setItem('tbAmigos',
            JSON.stringify(tbAmigos));
        listarContatos();
        $('#add').val('');
        $('.dialog').fadeIn('fast', function () {
            $('.ajaxmsg').html(
                '<strong> Amigo Adicionado com sucesso! </strong>' +
                '<button id="okNick">Ok</button>'
            ).fadeIn('slow');
            $('#okNick').on('click', function () {
                $('.ajaxmsg').fadeOut();
                $('.dialog').fadeOut();
                amigos();
                location.reload();
            });
        });

        $('#lista').show();
    };

    $('#formCadastro').submit(function () {
        event.preventDefault();
        if (edicao === false) {
            cadastrarContatos();
        } else {
            editarContatos(edicao); //edicao contem o nmero da linha
        };
    });

    if (tbAmigos === null) { // se não tiver nada na tbAmigos ele limpa e deixa a lista oculta
        tbAmigos = [];
        $('#lista').hide();
    };

});
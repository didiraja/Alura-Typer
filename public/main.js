var campo = $(".campo-digitacao");
var tempoInicial = $("#tempo-digitacao").text();

function atualizaTamanhoFrase() {
    
    var frase = $(".frase").text();
    var numPalavras = frase.split(" ").length;
    var tamanhoFrase = $("#tamanho-frase");
    tamanhoFrase.text(numPalavras);
    
}

function atualizaTempoInicial(tempo) {
    tempoInicial = tempo;
    $("#tempo-digitacao").text(tempo);
}

function inicializaContadores() {

    campo.on("input", function() {
        
        var frase = $(".frase").text();
    
        var conteudo = campo.val();

        var qtdPalavras = conteudo.split(/\S+/).length - 1;
        $("#contador-palavras").text(qtdPalavras);

        var qtdCaracteres = conteudo.length;
        $("#contador-caracteres").text(qtdCaracteres);
    
    });
    
}

function inicializaCronometro() {

    var tempoRestante = $("#tempo-digitacao").text();
    campo.one("focus", function(){
        
        var tempoRestante = $("#tempo-digitacao").text();
        
        $("#botao-reiniciar").attr("disabled",true);
        
        var cronometroID = setInterval(function() {
            
            tempoRestante--;
            $("#tempo-digitacao").text(tempoRestante);
            if (tempoRestante < 1) {
                clearInterval(cronometroID);
                $("#botao-reiniciar").attr("disabled", false);
                finalizaJogo();
            }
        }, 1000);

    });
    
}

function finalizaJogo() {
    campo.attr("disabled", true);
    campo.addClass("campo-desativado");
    inserePlacar();
}

$("#botao-reiniciar").click(reiniciaJogo);

function reiniciaJogo () {
    campo.attr("disabled",false);
    campo.val("");
    $("#contador-palavras").text("0");
    $("#contador-caracteres").text("0");
    $("#tempo-digitacao").text(tempoInicial);
    inicializaCronometro();
    campo.removeClass("campo-desativado");
    
    campo.removeClass("borda-vermelha");
    campo.removeClass("borda-verde");
}

function inicializaMarcadores() {
    
    campo.on("input", function() {
        
        var frase = $(".frase").text();
        
        var digitado = campo.val();
        var comparavel = frase.substr(0, digitado.length);
        
        if (digitado == comparavel) {
            campo.addClass("borda-verde");
            campo.removeClass("borda-vermelha");
        } else {
            campo.addClass("borda-vermelha");
            campo.removeClass("borda-verde");
        }
        
    });
}

function fraseAleatoria() {
    
    $("#spinner").toggle();
    
    $.get("//localhost:3000/frases", trocaFraseAleatoria)
        .fail(function(){
            $("#erro").slideToggle().show();
            setTimeout(function(){
                $("#erro").slideToggle().toggle();
            },1500);
    }).always(function(){
            $("#spinner").toggle();
    });
    
    function trocaFraseAleatoria(data) {
        var frase = $(".frase");
        var numeroAleatorio = Math.floor(Math.random() * data.length);
        
        frase.text(data[numeroAleatorio].texto);
        atualizaTamanhoFrase();
        atualizaTempoInicial(data[numeroAleatorio].tempo);
    }
}

function inserePlacar() {
    var corpoTabela = $(".placar").find("tbody");
    var usuario = "Dico";
    var numPalavras = $("#contador-palavras").text();
    
    var linha = novaLinha(usuario, numPalavras);
    linha.find(".botao-remover").click(removeLinha);
    
    corpoTabela.append(linha);
    
    $(".placar").slideDown(500);
    
    scrollPlacar();
}

function scrollPlacar() {
    var posicaoPlacar = $(".placar").offset().top;
    
    $("body").animate({
        scrollTop: posicaoPlacar + "px"        
    },1000);
}

function mostraPlacar() {
    $(".placar").stop().slideToggle(600);
}

function novaLinha(usuario, palavras) {
    var linha = $("<tr>");
    var colunaUsuario = $("<td>").text(usuario);
    var colunaPalavras = $("<td>").text(palavras);
    var colunaRemover = $("<td>");
    
    var link = $("<a>").attr("href","#").addClass("botao-remover");
    var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");
    
    link.append(icone);
    
    colunaRemover.append(link);
    
    linha.append(colunaUsuario);
    linha.append(colunaPalavras);
    linha.append(colunaRemover);
    
    return linha;
}

function removeLinha() {
    event.preventDefault();
    var linha = $(this).parent().parent();
    
    linha.fadeOut(1000, function() {
        linha.remove();          
    });
}

$(document).ready(function(){
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    inicializaMarcadores();
    $("#botao-reiniciar").click(reiniciaJogo);
    $("#botao-placar").click(mostraPlacar);
    $("#botao-frase").click(fraseAleatoria);
    $(".botao-remover").click(removeLinha);
});

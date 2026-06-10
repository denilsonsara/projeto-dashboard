function limparConsulta() {
    const ativa = document.querySelector("section:not(.hidden)");
    if (ativa) {
        ativa.querySelectorAll("input").forEach(function(campo) {
            if (!campo.readOnly) {
                campo.value = "";
            }
        });
        ativa.querySelectorAll("select").forEach(function(sel) {
            sel.selectedIndex = 0;
        });
        ativa.querySelectorAll(".resultado").forEach(function(res) {
            res.className = "resultado";
            res.innerHTML = "";
        });
    }
}

document.addEventListener("click", function(evento) {
    if (evento.target.classList.contains("btn-limpar")) {
        limparConsulta();
    }
});

function displayControler(id) {
    const sections = document.querySelectorAll("section");
    sections.forEach(function(section) {
        section.classList.add("hidden");
    });

    const alvo = document.querySelector("section." + id);
    if (alvo) {
        alvo.classList.remove("hidden");
    }

    const links = document.querySelectorAll("#menu a");
    links.forEach(function(link) {
        link.classList.remove("ativo");
    });

    const linkAtivo = document.getElementById(id);
    if (linkAtivo) {
        linkAtivo.classList.add("ativo");
    }
}

function formatarBRL(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarUSD(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "USD" });
}

function formatarNumero(valor, casas) {
    return valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

document.getElementById("menu").addEventListener("click", function(evento) {
    evento.preventDefault();

    const idClicado = evento.target.id;
    if (!idClicado) return;

    if (idClicado === "conversor") {
        buscarCotacao();
    }

    displayControler(idClicado);
});

document.getElementById("theme").addEventListener("click", function() {
    document.body.classList.toggle("dark");
    const temaEscuro = document.body.classList.contains("dark");
    this.src = temaEscuro ? "./img/sun.png" : "./img/moon.png";
});

let cotacaoAtual = null;

function buscarCotacao() {
    const statusEl = document.getElementById("cotacao-status");
    statusEl.textContent = "Buscando cotação...";

    fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            cotacaoAtual = parseFloat(data.USDBRL.bid);
            const cotacaoFormatada = cotacaoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
            statusEl.innerHTML = "<strong>1 USD = R$ " + cotacaoFormatada + "</strong> &nbsp;|&nbsp; Dólar";
            document.getElementById("cotacao-box").className = "cotacao-box cotacao-ok";
        })
        .catch(function() {
            statusEl.textContent = "Erro ao buscar cotação. Verifique sua conexão.";
            document.getElementById("cotacao-box").className = "cotacao-box cotacao-erro";
        });
}

document.getElementById("btn-converter").addEventListener("click", function() {
    const valor     = parseFloat(document.getElementById("conv-valor").value);
    const direcao   = document.getElementById("conv-direcao").value;
    const resultado = document.getElementById("conv-resultado");

    if (isNaN(valor) || valor <= 0) {
        resultado.className = "resultado erro";
        resultado.innerHTML = "Campo <strong>Valor</strong> não pode ser vazio ou zero.";
        return;
    }
    if (!cotacaoAtual) {
        resultado.className = "resultado erro";
        resultado.innerHTML = "Cotação ainda não carregada. Aguarde.";
        return;
    }

    const cotacaoFormatada = cotacaoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    let de, para;

    if (direcao === "UD") {
        const convertido = valor * cotacaoAtual;
        de   = formatarUSD(valor);
        para = formatarBRL(convertido);
    } else {
        const convertido = valor / cotacaoAtual;
        de   = formatarBRL(valor);
        para = formatarUSD(convertido);
    }

    resultado.className = "resultado ok";
    resultado.innerHTML =
        "<p><strong>" + de + "</strong> = <strong>" + para + "</strong></p>" +
        "<p class='taxa'>Cotação utilizada (bid): R$ " + cotacaoFormatada + "</p>";
});

document.getElementById("btn-calcular-imc").addEventListener("click", function() {
    const peso      = parseFloat(document.getElementById("imc-peso").value);
    const altura    = parseFloat(document.getElementById("imc-altura").value);
    const genero    = document.getElementById("imc-genero").value;
    const resultado = document.getElementById("imc-resultado");

    const erros = [];
    if (isNaN(peso)   || peso <= 0)   { erros.push("<strong>Peso</strong> inválido ou vazio"); }
    if (isNaN(altura) || altura <= 0) { erros.push("<strong>Altura</strong> inválida ou zero"); }
    if (!genero)                      { erros.push("<strong>Gênero</strong> não selecionado"); }

    if (erros.length > 0) {
        resultado.className = "resultado erro";
        resultado.innerHTML = "Corrija: " + erros.join(" | ");
        return;
    }

    const imc = peso / (altura * altura);
    const imcFormatado = formatarNumero(imc, 2);
    let classificacao = "";

    if (genero === "M") {
        if (imc < 18.5)       { classificacao = "Abaixo do peso"; }
        else if (imc <= 24.9) { classificacao = "Normal"; }
        else if (imc <= 29.9) { classificacao = "Sobrepeso"; }
        else                  { classificacao = "Obesidade"; }
    } else {
        if (imc < 18.5)       { classificacao = "Abaixo do peso"; }
        else if (imc <= 23.9) { classificacao = "Normal"; }
        else if (imc <= 28.9) { classificacao = "Sobrepeso"; }
        else                  { classificacao = "Obesidade"; }
    }

    resultado.className = "resultado ok";
    resultado.innerHTML =
        "<p><strong>IMC:</strong> " + imcFormatado + "</p>" +
        "<p><strong>Gênero:</strong> " + (genero === "M" ? "Masculino" : "Feminino") + "</p>" +
        "<p><strong>Classificação:</strong> " + classificacao + "</p>";
});

document.getElementById("btn-converter-temp").addEventListener("click", function() {
    const valor     = parseFloat(document.getElementById("temp-valor").value);
    const direcao   = document.getElementById("temp-direcao").value;
    const resultado = document.getElementById("temp-resultado");

    if (isNaN(valor)) {
        resultado.className = "resultado erro";
        resultado.innerHTML = "Campo <strong>Valor</strong> não pode ser vazio.";
        return;
    }

    let convertido, de, para;

    if (direcao === "CF") {
        convertido = (valor * 1.8) + 32;
        de   = formatarNumero(valor, 2) + " °C";
        para = formatarNumero(convertido, 2) + " °F";
    } else {
        convertido = (valor - 32) / 1.8;
        de   = formatarNumero(valor, 2) + " °F";
        para = formatarNumero(convertido, 2) + " °C";
    }

    resultado.className = "resultado ok";
    resultado.innerHTML = "<p><strong>" + de + "</strong> = <strong>" + para + "</strong></p>";
});

document.getElementById("btn-converter-vel").addEventListener("click", function() {
    const valor     = parseFloat(document.getElementById("vel-valor").value);
    const direcao   = document.getElementById("vel-direcao").value;
    const resultado = document.getElementById("vel-resultado");

    if (isNaN(valor) || valor < 0) {
        resultado.className = "resultado erro";
        resultado.innerHTML = "Campo <strong>Valor</strong> não pode ser vazio ou negativo.";
        return;
    }

    let convertido, de, para;

    if (direcao === "KM") {
        convertido = valor * 0.621371;
        de   = formatarNumero(valor, 2) + " km/h";
        para = formatarNumero(convertido, 2) + " mph";
    } else {
        convertido = valor / 0.621371;
        de   = formatarNumero(valor, 2) + " mph";
        para = formatarNumero(convertido, 2) + " km/h";
    }

    resultado.className = "resultado ok";
    resultado.innerHTML = "<p><strong>" + de + "</strong> = <strong>" + para + "</strong></p>";
});

document.getElementById("btn-converter-massa").addEventListener("click", function() {
    const valor     = parseFloat(document.getElementById("massa-valor").value);
    const direcao   = document.getElementById("massa-direcao").value;
    const resultado = document.getElementById("massa-resultado");

    if (isNaN(valor) || valor < 0) {
        resultado.className = "resultado erro";
        resultado.innerHTML = "Campo <strong>Valor</strong> não pode ser vazio ou negativo.";
        return;
    }

    let convertido, de, para;

    if (direcao === "KL") {
        convertido = valor * 2.20462;
        de   = formatarNumero(valor, 2) + " kg";
        para = formatarNumero(convertido, 2) + " lbs";
    } else {
        convertido = valor / 2.20462;
        de   = formatarNumero(valor, 2) + " lbs";
        para = formatarNumero(convertido, 2) + " kg";
    }

    resultado.className = "resultado ok";
    resultado.innerHTML = "<p><strong>" + de + "</strong> = <strong>" + para + "</strong></p>";
});

document.getElementById("btn-calcular-r3").addEventListener("click", function() {
    const a         = parseFloat(document.getElementById("r3-a").value);
    const b         = parseFloat(document.getElementById("r3-b").value);
    const c         = parseFloat(document.getElementById("r3-c").value);
    const campoX    = document.getElementById("r3-x");
    const resultado = document.getElementById("r3-resultado");

    const erros = [];
    if (isNaN(a) || a === 0) { erros.push("<strong>A</strong> não pode ser zero ou vazio (divisão por zero)"); }
    if (isNaN(b))            { erros.push("<strong>B</strong> está vazio"); }
    if (isNaN(c))            { erros.push("<strong>C</strong> está vazio"); }

    if (erros.length > 0) {
        campoX.value = "";
        resultado.className = "resultado erro";
        resultado.innerHTML = "Corrija: " + erros.join(" | ");
        return;
    }

    const x = (b * c) / a;
    campoX.value = formatarNumero(x, 4);

    resultado.className = "resultado ok";
    resultado.innerHTML =
        "<p><strong>A:</strong> " + formatarNumero(a, 2) + " &nbsp;|&nbsp; " +
        "<strong>B:</strong> " + formatarNumero(b, 2) + " &nbsp;|&nbsp; " +
        "<strong>C:</strong> " + formatarNumero(c, 2) + "</p>" +
        "<p>X = (B × C) / A = (" + formatarNumero(b, 2) + " × " + formatarNumero(c, 2) + ") / " + formatarNumero(a, 2) + " = <strong>" + formatarNumero(x, 4) + "</strong></p>";
});

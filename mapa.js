// Cria a variável tipo lista (array) para ser usada com os dados do arquivo JSON externo.
let lugares = [];

// Cria a variável tipo lista (array) para ser usada com os marcadores do mapa.
let marcadores = [];
let marcadoresCirculo = [];

// Executa a função 'obterDados().
obterDados();

// Define a função assíncrona 'obterDados()'.
async function obterDados() {
    // A função 'fetch' ler o arquivo 'lugares.json' e guarda na variável 'resposta'.
    let resposta = await fetch('lugares.json');

    // O operador 'await' pausa a função para receber o retorno da solicitação, que no caso é um objeto tipo JSON, 
    lugares = await resposta.json();

    // Observação: cada objeto da lista é acessado pelo seu índice, que começa com 0, 
    // como 'lugares' tem três objetos, os índices são 0, 1 e 2.
    // O índice fica entre colchetes '[índice]' após o nome da lista de objetos, seguido de '.' e o nome da chave.
    // Por exemplo, para acessar o valor da chave 'nome' do primeiro objeto da lista é usado 'lugares[0].nome' 

    // Executa a função 'carregarMapa()'.
    carregarMapa();
}

// Define a função 'carregarMapa()'.
function carregarMapa() {

    // Cria um array com ícones dos marcadores no mapa.
    let icones = [
        L.icon({
            iconUrl: 'iconeDino.png', // Arquivo de imagem do ícone.
            iconSize: [30, 30], // Tamanho do ícone em pixels.
            iconAnchor: [15, 30], // Ponto no ícone que corresponde a localizaão do marcador.
            popupAnchor: [0, -32] // Ponto quue o popup deve abrir em relação à posição do ícone.
        }),
        L.icon({
            iconUrl: 'iconeCacto.png', // Arquivo de imagem do ícone.
            iconSize: [30, 30], // Tamanho do ícone em pixels.
            iconAnchor: [15, 30], // Ponto no ícone que corresponde a localizaão do marcador.
            popupAnchor: [0, -32] // Ponto quue o popup deve abrir em relação à posição do ícone.
        }),
        L.icon({
            iconUrl: 'iconeSerra.png', // Arquivo de imagem do ícone.
            iconSize: [30, 30], // Tamanho do ícone em pixels.
            iconAnchor: [15, 30], // Ponto no ícone que corresponde a localizaão do marcador.
            popupAnchor: [0, -32] // Ponto quue o popup deve abrir em relação à posição do ícone.
        })
    ];
    let iconeGeossitio = L.icon({
        iconUrl: 'iconeGeossitio.png', // Arquivo de imagem do ícone.
        iconSize: [20, 30], // Tamanho do ícone em pixels.
        iconAnchor: [10, 30], // Ponto no ícone que corresponde a localizaão do marcador.
        popupAnchor: [0, -32] // Ponto quue o popup deve abrir em relação à posição do ícone.
    });

    //Existem dois tipos de camadas (layers): 'base layers' que são as camadas de imagens (tiles layers) do mapa;
    // e 'overlays' que são os ítens adicionados sobre a 'base layers'. 
    // No caso deste exercício, o 'base layer' é a imagem do mapa 
    // e o 'overlay' são os marcadores.


    // Cria três 'base layers', as imagens dos mapas: um padrão do OpenstreetMaps, e um topográfico.
    let mapaBase = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    let mapaOpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


    // A função 'for' é um loop (ou laço) com um número determinado de repetições,
    // e geralmente tem a seguinte estrtura (inicialização; condição; atualização){declarações executadas se a condição for verdadeira}
    // Observação: '++' significa adicionar '1', portanto a expressão 'i++' é equivalente a 'i = i + 1'.
    // Como 'lugares.length' retorna 3, neste caso as declaçõres de 'for' (o que está entre chaves {}) serão executadas 3 vezes.
    for (let i = 0; i < lugares.length; i++) {
        // Cria marcadores nas coordenadas especificadas em 'lugares[i]' com os respectivos ícones.
        marcadores[i] = L.marker([lugares[i].lat, lugares[i].long], {
            icon: icones[i]
        });

        // Cria a variável 'geoparqueInfo' com as informações dos geoparques contidas em 'lugares'.
        let geoparqueInfo = "<h2>" + lugares[i].nome + "</h2> Região: " + lugares[i].regiao + " - " + lugares[i].estado +
            "<br> Área do Geoparquue: " + lugares[i].area +
            "<br> Geossítios: " + lugares[i].geossitio.length +
            "<br> Reconhecido pela UNESCO em: " +
            lugares[i].ano + `<br> Site: <a href='${lugares[i].site}' target='blank'>` + lugares[i].site + "</a>";

        // Inclui o texto de 'geoparqueInfo' nos marcadores[i], que são exibidos quando clicados.
        marcadores[i].bindPopup(geoparqueInfo);


        // Para cada 'lugares[i]', é executada N vezes a função de adicionar marcadores dos geossítios.
        // Como cada geoparque tem numero diferente de geossitios, a quantidade de vezes N é de acordo com o tamanho do array 'geossitio'.

        for (let j = 0; j < lugares[i].geossitio.length; j++) {

            // Adiciona no array 'marcadoresCirculo' com push() os marcadores geométricos nas coordenadas especificadas em 'lugares[i]' 
            // com opções de cor e raio do círculo.
            // Em seguida, adiciona texto em 'bindPopup()' com as informações do geossítio.
            marcadoresCirculo.push(L.marker([lugares[i].geossitio[j].geoLat, lugares[i].geossitio[j].geoLong], {
                icon: iconeGeossitio
            }).bindPopup(
                "<h3>" + lugares[i].geossitio[j].geoNome + "</h3>" +
                `<a href='${lugares[i].site}' target='blank'>` + lugares[i].nome + "</a>" +
                "<br>" + lugares[i].geossitio[j].geoCidade +
                "<br> Latitude, longitude:<br>" + lugares[i].geossitio[j].geoLat + ", " + lugares[i].geossitio[j].geoLong));
        }
    }

    // Cria o grupo de camada 'grupoGeoparques' com os 'marcadores'.
    let grupoGeoparques = L.layerGroup(marcadores);
    // Cria o grupo de camada 'grupoGeossitios' com os 'marcadoresCirculo'.
    let grupoGeossitios = L.layerGroup(marcadoresCirculo);

    // Cria o objeto 'meuMapa' com a vista centralizada na latitude e longitude de 'lugares[0]' com um zoom inicial de 1.
    // Adiciona como 'base layer' o 'mapaBase' e como 'overlay' o grupo 'grupoGeoparques'.
    let meuMapa = L.map('mapaLeaflet', {
        layers: [mapaBase, grupoGeoparques]
    }).setView([lugares[0].lat, lugares[0].long], 1);

    // Cria os ítens de 'base layers' que serão exibidos no menu de controle do mapa.
    let controleBaseLayers = {
        "Mapa padrão OpenStreetMap": mapaBase,
        "Mapa topográfico OpenTopoMap": mapaOpenTopoMap
    };

    // Cria os ítens de 'overlays' que serão exibidos no menu de controle do mapa.
    let controleOverlays = {
        "Marcadores dos Geoparques": grupoGeoparques,
        "Marcadores dos Geossítios": grupoGeossitios
    };

    // Adiciona o menu de controle ao mapa com as 'base layers' e 'overlays'.
    L.control.layers(controleBaseLayers, controleOverlays).addTo(meuMapa);

    // Centraliza o mapa de acordo com as coordenadas mais externas dos geoparques.
    meuMapa.fitBounds([
        [lugares[1].lat, lugares[1].long],
        [lugares[2].lat, lugares[2].long],
    ], {
        padding: [80, 80]
    });

}
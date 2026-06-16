const destinos = [
  {
    id: 1,
    nome: "Paris",
    preco: 3200,
    imagem: "../img/paris-400.jpg",
    imagemWebp: "../img/paris-400.webp",
    imagemSrcSet: "../img/paris-400.jpg 400w, ../img/paris-800.jpg 800w, ../img/paris-1200.jpg 1200w",
    imagemWebpSrcSet: "../img/paris-400.webp 400w, ../img/paris-800.webp 800w, ../img/paris-1200.webp 1200w",
    imagemLarge: "../img/paris-1200.jpg",
    descricao: "Cidade luz, romântica e cultural."
  },
  {
    id: 2,
    nome: "Rio de Janeiro",
    preco: 850,
    imagem: "../img/rio-400.jpg",
    imagemWebp: "../img/rio-400.webp",
    imagemSrcSet: "../img/rio-400.jpg 400w, ../img/rio-800.jpg 800w, ../img/rio-1200.jpg 1200w",
    imagemWebpSrcSet: "../img/rio-400.webp 400w, ../img/rio-800.webp 800w, ../img/rio-1200.webp 1200w",
    imagemLarge: "../img/rio-1200.jpg",
    descricao: "Praias, sol e paisagens incríveis."
  },
  {
    id: 3,
    nome: "Orlando",
    preco: 4500,
    imagem: "../img/orlando-400.jpg",
    imagemWebp: "../img/orlando-400.webp",
    imagemSrcSet: "../img/orlando-400.jpg 400w, ../img/orlando-800.jpg 800w, ../img/orlando-1200.jpg 1200w",
    imagemWebpSrcSet: "../img/orlando-400.webp 400w, ../img/orlando-800.webp 800w, ../img/orlando-1200.webp 1200w",
    imagemLarge: "../img/orlando-1200.jpg",
    descricao: "Parques e diversão para toda a família."
  },
  {
    id: 4,
    nome: "Buenos Aires",
    preco: 1200,
    imagem: "../img/buenos-400.jpg",
    imagemWebp: "../img/buenos-400.webp",
    imagemSrcSet: "../img/buenos-400.jpg 400w, ../img/buenos-800.jpg 800w, ../img/buenos-1200.jpg 1200w",
    imagemWebpSrcSet: "../img/buenos-400.webp 400w, ../img/buenos-800.webp 800w, ../img/buenos-1200.webp 1200w",
    imagemLarge: "../img/buenos-1200.jpg",
    descricao: "Cultura, tango e gastronomia."
  }
];

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let listaAtual = [...destinos];

const lista = document.getElementById("listaDestinos");

function renderizarDestinos(listaDestinos) {
  lista.innerHTML = "";

  listaDestinos.forEach(destino => {
    const favorito = favoritos.includes(destino.id) ? "❤️" : "🤍";

    // suporte a WebP quando disponível, e atributos de acessibilidade/performance
    // montar srcset e sizes para imagens responsivas
    const sizes = '(max-width: 600px) 100vw, 260px';

    const imgHTML = destino.imagemWebpSrcSet
      ? `<picture>
           <source srcset="${destino.imagemWebpSrcSet}" type="image/webp" sizes="${sizes}">
           <img src="${destino.imagem}" srcset="${destino.imagemSrcSet}" sizes="${sizes}" alt="${destino.nome}" loading="lazy">
         </picture>`
      : `<img src="${destino.imagem}" srcset="${destino.imagemSrcSet || ''}" sizes="${sizes}" alt="${destino.nome}" loading="lazy">`;

    lista.innerHTML += `
      <div class="card">
        ${imgHTML}
        <h3>${destino.nome}</h3>
        <p>R$ ${destino.preco}</p>

        <button onclick="abrirModal(${destino.id})">Detalhes</button>
        <button onclick="toggleFavorito(${destino.id})">${favorito}</button>
      </div>
    `;
  });
}

function buscarViagem() {
  const nome = document.getElementById("buscarDestino").value.toLowerCase();
  const preco = document.getElementById("buscarPreco").value;

  listaAtual = destinos.filter(d => {
    const nomeOk = d.nome.toLowerCase().includes(nome);
    const precoOk = preco ? d.preco <= preco : true;
    return nomeOk && precoOk;
  });

  if (listaAtual.length === 0) {
    lista.innerHTML = `<p class="placeholder">Nenhum destino encontrado.</p>`;
  } else {
    renderizarDestinos(listaAtual);
  }
}

function ordenarPreco() {
  const tipo = document.getElementById("ordenar").value;

  if (tipo === "menor") listaAtual.sort((a, b) => a.preco - b.preco);
  if (tipo === "maior") listaAtual.sort((a, b) => b.preco - a.preco);

  renderizarDestinos(listaAtual);
}

function toggleFavorito(id) {
  favoritos = favoritos.includes(id)
    ? favoritos.filter(f => f !== id)
    : [...favoritos, id];

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  renderizarDestinos(listaAtual);
}

function abrirModal(id) {
  const d = destinos.find(dest => dest.id === id);

  // atualizar source WebP (se existir) e img do modal
  const modalSource = document.getElementById("modalSourceWebp");
  const modalImg = document.getElementById("modalImg");

  // para o modal preferimos a imagem maior (ou o srcset grande se disponível)
  if (modalSource) {
    if (d.imagemWebpSrcSet) modalSource.srcset = d.imagemWebpSrcSet.replace(/\s\d+w/g, '');
    else if (d.imagemWebp) modalSource.srcset = d.imagemWebp;
  }

  if (modalImg) {
    modalImg.src = d.imagemLarge || d.imagem;
    modalImg.alt = d.nome;
  }

  document.getElementById("modalTitulo").textContent = d.nome;
  document.getElementById("modalPreco").textContent = `Preço: R$ ${d.preco}`;
  document.getElementById("modalDesc").textContent = d.descricao;

  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Não renderiza destinos ao carregar: mostra instrução para buscar
function mostrarPlaceholder() {
  lista.innerHTML = `<p class="placeholder">Faça uma busca para ver destinos.</p>`;
}

// permitir que Enter nos inputs dispare a busca
const inputNome = document.getElementById("buscarDestino");
const inputPreco = document.getElementById("buscarPreco");
if (inputNome) inputNome.addEventListener("keyup", e => { if (e.key === "Enter") buscarViagem(); });
if (inputPreco) inputPreco.addEventListener("keyup", e => { if (e.key === "Enter") buscarViagem(); });

mostrarPlaceholder();

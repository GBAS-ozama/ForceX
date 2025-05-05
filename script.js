let carrinho = [];
let cupomAplicado = null;
let desconto = 0;

const carrinhoOverlay = document.getElementById('carrinhoOverlay');
const carrinhoItensContainer = document.getElementById('carrinhoItens');
const carrinhoTotalElement = document.getElementById('carrinhoTotal');
const abrirCarrinhoButtons = document.querySelectorAll('.abrir-carrinho');
const fecharCarrinhoButton = document.querySelector('.fechar-carrinho');
const btnComprarButtons = document.querySelectorAll('.btn-comprar');
const limparCarrinhoButton = document.getElementById('limparCarrinho');
const finalizarCompraButton = document.getElementById('finalizarCompra');
const finalizacaoOverlay = document.getElementById('finalizacaoOverlay');
const fecharFinalizacaoButton = document.querySelector('.fechar-finalizacao');
const cancelarFinalizacaoButton = document.getElementById('cancelarFinalizacao');
const finalizacaoForm = document.getElementById('finalizacaoForm');
const cupomInput = document.getElementById('cupom');
const cupomDropdown = document.getElementById('cupomDropdown');
const cupomOptions = document.querySelectorAll('.cupom-option');
const descontoInfo = document.getElementById('descontoInfo');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const slide = document.getElementById('slide');
const imagens = slide.querySelectorAll('img');
const totalSlides = imagens.length;
let index = 0;
let intervalo;

function abrirCarrinho() {
  carrinhoOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  carrinhoOverlay.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function abrirFinalizacao() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  finalizacaoOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function fecharFinalizacao() {
  finalizacaoOverlay.style.display = 'none';
  document.body.style.overflow = 'hidden';
}

function adicionarAoCarrinho(id, nome, preco, imagem) {
  const itemExistente = carrinho.find(item => item.id === id);
  
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      id,
      nome,
      preco: parseFloat(preco),
      imagem,
      quantidade: 1
    });
  }
  
  atualizarCarrinho();
  abrirCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  cupomAplicado = null;
  desconto = 0;
  atualizarCarrinho();
}

function calcularTotal() {
  let subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  
  let aumento = 0;
  if (cupomAplicado === "AUMENTAPRECO") {
    aumento = 30;
  }
  
  let totalComDesconto = (subtotal * (1 - desconto / 100)) + aumento;
  
  return {
    subtotal: subtotal.toFixed(2),
    total: totalComDesconto.toFixed(2),
    descontoValor: (subtotal * desconto / 100).toFixed(2),
    aumento: aumento
  };
}

function atualizarCarrinho() {
  if (carrinho.length === 0) {
    carrinhoItensContainer.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
    carrinhoTotalElement.textContent = '0,00';
    descontoInfo.textContent = '';
    descontoInfo.classList.remove('show');
    return;
  }
  
  carrinhoItensContainer.innerHTML = '';
  
  const { subtotal, total, descontoValor, aumento } = calcularTotal();
  
  carrinho.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'carrinho-item';
    itemElement.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img">
      <div class="carrinho-item-info">
        <h3 class="carrinho-item-nome">${item.nome}</h3>
        <p class="carrinho-item-preco">R$${item.preco.toFixed(2)} x ${item.quantidade}</p>
        <p class="carrinho-item-subtotal">Subtotal: R$${(item.preco * item.quantidade).toFixed(2)}</p>
      </div>
    `;
    
    carrinhoItensContainer.appendChild(itemElement);
  });
  
  if (desconto > 0 || aumento > 0) {
    let infoText = '';
    
    if (desconto > 0) {
      infoText += `Desconto de ${desconto}% aplicado (R$${descontoValor.replace('.', ',')})`;
    }
    
    if (aumento > 0) {
      if (infoText) infoText += '<br>';
      infoText += `Acréscimo de R$${aumento.toFixed(2)} aplicado`;
    }
    
    carrinhoTotalElement.innerHTML = `
      <span style="text-decoration: line-through; color: #777;">R$${subtotal.replace('.', ',')}</span>
      R$${total.replace('.', ',')}
    `;
    descontoInfo.innerHTML = infoText;
    descontoInfo.classList.add('show');
  } else {
    carrinhoTotalElement.textContent = total.replace('.', ',');
    descontoInfo.textContent = '';
    descontoInfo.classList.remove('show');
  }
}

function aplicarCupom(codigoCupom) {
  const cupomValido = Array.from(cupomOptions).find(option => 
    option.getAttribute('data-codigo') === codigoCupom
  );
  
  if (cupomValido) {
    cupomAplicado = codigoCupom;
    
    if (cupomValido.hasAttribute('data-aumento')) {
      desconto = 0;
    } else {
      desconto = parseFloat(cupomValido.getAttribute('data-desconto'));
    }
    
    atualizarCarrinho();
    return true;
  }
  
  return false;
}

function finalizarCompra(event) {
  event.preventDefault();
  
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const endereco = document.getElementById('endereco').value;
  const metodoPagamento = document.querySelector('input[name="pagamento"]:checked').value;
  const cupom = cupomInput.value;
  
  if (cupom && cupom !== cupomAplicado) {
    if (!aplicarCupom(cupom)) {
      alert('Cupom inválido!');
      return;
    }
  }
  
  const { total } = calcularTotal();
  
  alert(`Compra finalizada com sucesso!\n\nNome: ${nome}\nE-mail: ${email}\nEndereço: ${endereco}\nMétodo de Pagamento: ${metodoPagamento}\n${cupomAplicado ? 'Cupom: ' + cupomAplicado + ' (' + (cupomAplicado === "AUMENTAPRECO" ? "+R$30,00" : desconto + '% de desconto') + ')' : ''}\nTotal: R$${total.replace('.', ',')}`);
  
  limparCarrinho();
  fecharFinalizacao();
  fecharCarrinho();
  
  finalizacaoForm.reset();
}

function atualizarSlide() {
  slide.style.transform = `translateX(-${index * 100}vw)`;
}

function avancarSlide() {
  index = (index + 1) % totalSlides;
  atualizarSlide();
  resetarIntervalo();
}

function voltarSlide() {
  index = (index - 1 + totalSlides) % totalSlides;
  atualizarSlide();
  resetarIntervalo();
}

function iniciarCarrossel() {
  intervalo = setInterval(() => {
    avancarSlide();
  }, 5000);
}

function resetarIntervalo() {
  clearInterval(intervalo);
  iniciarCarrossel();
}

abrirCarrinhoButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    abrirCarrinho();
  });
});

fecharCarrinhoButton.addEventListener('click', fecharCarrinho);
fecharFinalizacaoButton.addEventListener('click', fecharFinalizacao);
cancelarFinalizacaoButton.addEventListener('click', fecharFinalizacao);

btnComprarButtons.forEach(button => {
  button.addEventListener('click', () => {
    const id = button.getAttribute('data-id');
    const nome = button.getAttribute('data-nome');
    const preco = button.getAttribute('data-preco');
    const imagem = button.getAttribute('data-imagem');
    
    adicionarAoCarrinho(id, nome, preco, imagem);
  });
});

limparCarrinhoButton.addEventListener('click', limparCarrinho);
finalizarCompraButton.addEventListener('click', abrirFinalizacao);
finalizacaoForm.addEventListener('submit', finalizarCompra);

cupomInput.addEventListener('focus', () => {
  cupomDropdown.classList.add('show');
});

cupomInput.addEventListener('blur', () => {
  setTimeout(() => {
    cupomDropdown.classList.remove('show');
  }, 200);
});

cupomInput.addEventListener('input', (e) => {
  const valor = e.target.value.toUpperCase();
  cupomOptions.forEach(option => {
    const codigo = option.getAttribute('data-codigo');
    if (codigo.includes(valor)) {
      option.style.display = 'block';
    } else {
      option.style.display = 'none';
    }
  });
});

cupomOptions.forEach(option => {
  option.addEventListener('click', () => {
    const codigo = option.getAttribute('data-codigo');
    cupomInput.value = codigo;
    cupomDropdown.classList.remove('show');
    aplicarCupom(codigo);
  });
});

carrinhoOverlay.addEventListener('click', (e) => {
  if (e.target === carrinhoOverlay) {
    fecharCarrinho();
  }
});

finalizacaoOverlay.addEventListener('click', (e) => {
  if (e.target === finalizacaoOverlay) {
    fecharFinalizacao();
  }
});

prevButton.addEventListener('click', voltarSlide);
nextButton.addEventListener('click', avancarSlide);

atualizarSlide();
iniciarCarrossel();
const campoMinado = document.getElementById('campo-minado');
const reiniciarBtn = document.getElementById('reiniciar');
const linhas = 10;
const colunas = 10; 
const quantidadeMinas = 15; 

let matriz = []; 
let jogoAtivo = true;

function criarCampo() {
    matriz = [];
    campoMinado.innerHTML = '';
    campoMinado.style.gridTemplateColumns = `repeat(${colunas}, 40px)`;

    for (let i = 0; i < linhas; i++) {
        matriz[i] = [];
        for (let j = 0; j < colunas; j++) {
            const celula = document.createElement('div');
            celula.classList.add('celula');
            celula.setAttribute('data-linha', i);
            celula.setAttribute('data-coluna', j);
            campoMinado.appendChild(celula);
            matriz[i][j] = { minada: false, revelada: false, elemento: celula };
        }
    }
    plantarMinas();
}

function plantarMinas() {
    let minasPlantadas = 0;

    while (minasPlantadas < quantidadeMinas) {
        const linha = Math.floor(Math.random() * linhas);
        const coluna = Math.floor(Math.random() * colunas);

        if (!matriz[linha][coluna].minada) {
            matriz[linha][coluna].minada = true;
            minasPlantadas++;
        }
    }
}

function revelarCelula(linha, coluna) {
    if (linha < 0 || linha >= linhas || coluna < 0 || coluna >= colunas) return;
    const celula = matriz[linha][coluna];

    if (celula.revelada || celula.flag) return;

    celula.revelada = true;
    celula.elemento.classList.add('revelada');

    if (celula.minada) {
        celula.elemento.classList.add('minada');
        encerrarJogo(false);
        return;
    }

    const minasAoRedor = contarMinasAoRedor(linha, coluna);

    if (minasAoRedor > 0) {
        celula.elemento.textContent = minasAoRedor;
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revelarCelula(linha + i, coluna + j);
            }
        }
    }
}

function contarMinasAoRedor(linha, coluna) {
    let minas = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const l = linha + i;
            const c = coluna + j;
            if (l >= 0 && l < linhas && c >= 0 && c < colunas) {
                if (matriz[l][c].minada) minas++;
            }
        }
    }
    return minas;
}

function encerrarJogo(vitoria) {
    jogoAtivo = false;

    matriz.forEach(linha => {
        linha.forEach(celula => {
            if (celula.minada) {
                celula.elemento.classList.add('minada');
            }
        });
    });

    if (!vitoria) {
        alert('💥 Você perdeu! Tente novamente.');
    } else {
        alert('🎉 Parabéns! Você venceu!');
    }
}

campoMinado.addEventListener('click', (e) => {
    if (!jogoAtivo) return;

    const celula = e.target;
    const linha = parseInt(celula.getAttribute('data-linha'));
    const coluna = parseInt(celula.getAttribute('data-coluna'));

    revelarCelula(linha, coluna);

    if (verificarVitoria()) {
        encerrarJogo(true);
    }
});

campoMinado.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!jogoAtivo) return;

    const celula = e.target;
    if (!celula.classList.contains('revelada')) {
        celula.classList.toggle('flag');
    }
});

function verificarVitoria() {
    return matriz.every(linha => 
        linha.every(celula => 
            (celula.revelada && !celula.minada) || celula.minada
        )
    );
}

reiniciarBtn.addEventListener('click', () => {
    jogoAtivo = true;
    criarCampo();
});

criarCampo();

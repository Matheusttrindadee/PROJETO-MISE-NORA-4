import { supabase } from './conexao.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("Mise Nora inicializado com sucesso!");
    
    // 1. Inicializa a mesa via URL
    inicializarMesa();

    // 2. Inicializa o sistema de abas da página de perfil
    inicializarAbasPerfil();
});

// Função para capturar e salvar o número da mesa
function inicializarMesa() {
    const urlParams = new URLSearchParams(window.location.search);
    const mesaUrl = urlParams.get('mesa');

    if (mesaUrl) {
        localStorage.setItem('mise_mesa', mesaUrl);
        console.log(`Mesa ${mesaUrl} identificada via URL.`);
    }

    const mesaAtual = localStorage.getItem('mise_mesa');
    const elementoMesa = document.getElementById('numero-mesa');
    
    if (elementoMesa && mesaAtual) {
        elementoMesa.textContent = `Mesa: ${mesaAtual}`;
    }
}

// Função unificada para gerenciar as abas do perfil
function inicializarAbasPerfil() {
    const secoes = document.querySelectorAll('main > section');
    const botoesAba = document.querySelectorAll('.botao-aba');

    if (botoesAba.length === 0 || secoes.length === 0) return;

    // Estado inicial: exibe apenas a primeira seção e oculta o resto
    secoes.forEach((secao, index) => {
        if (index === 0) {
            secao.classList.remove('secao-oculta');
        } else {
            secao.classList.add('secao-oculta');
        }
    });

    // Gerencia o clique em cada aba
    botoesAba.forEach(botao => {
        botao.addEventListener('click', () => {
            const idAlvo = botao.getAttribute('data-alvo');

            // Remove a classe 'ativo' de todos os botões e adiciona no clicado
            botoesAba.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');

            // Oculta todas as seções
            secoes.forEach(secao => {
                secao.classList.add('secao-oculta');
            });

            // Mostra apenas a seção correspondente ao botão clicado
            const secaoAtiva = document.getElementById(idAlvo);
            if (secaoAtiva) {
                secaoAtiva.classList.remove('secao-oculta');
            }
        });
    });
}

// 3. Efeito único e infalível para encolher o cabeçalho ao rolar a página
const verificarScroll = () => {
    const cabecalho = document.querySelector('.header-container');
    if (!cabecalho) return;

    const posicaoScroll = window.scrollY || document.documentElement.scrollTop;

    if (posicaoScroll > 15) {
        cabecalho.classList.add('rolado');
    } else {
        cabecalho.classList.remove('rolado');
    }
};

window.addEventListener('scroll', verificarScroll);
document.addEventListener('scroll', verificarScroll, true);

// Ações globais para os botões Sair e Excluir Conta (Garantido)
document.addEventListener('click', (e) => {
    // Procura se o elemento clicado (ou qualquer ancestral dele) é o botão de Sair
    const btnLogout = e.target.closest('#btn-logout');
    if (btnLogout) {
        e.preventDefault();
        localStorage.removeItem('mise_mesa');
        alert("Sessão encerrada com sucesso!");
        window.location.href = 'login.html';
        return;
    }

    // Procura se o elemento clicado (ou qualquer ancestral dele) é o botão de Excluir Conta
    const btnExcluir = e.target.closest('#btn-excluir-conta');
    if (btnExcluir) {
        e.preventDefault();
        if (confirm("Tem certeza de que deseja excluir a sua conta? Esta ação é irreversível.")) {
            localStorage.clear();
            alert("A sua conta foi excluída com sucesso.");
            window.location.href = 'index.html';
        }
        return;
    }
});
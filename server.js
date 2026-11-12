const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Configuração do Supabase (substitua pelas suas variáveis ou use o .env)
const supabaseUrl = process.env.SUPABASE_URL || 'SUA_URL_DO_SUPABASE';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'SUA_CHAVE_ANON_DO_SUPABASE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Configura o Express para servir arquivos estáticos da pasta atual
app.use(express.static(path.join(__dirname)));

// Rota principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota do Painel Administrativo
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Rota de Cadastro
app.post('/cadastrar', (req, res) => {
    const dadosDoCadastro = req.body;
    console.log("Dados do cadastro recebidos:", dadosDoCadastro);
    res.status(201).json({ sucesso: true, mensagem: "Cadastro realizado com sucesso!" });
});

// ==========================================
// ROTAS INTEGRADAS AO SUPABASE (Tabela: pedidos)
// ==========================================

// Rota para o painel buscar os pedidos do Supabase
app.get('/api/pedidos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error.message);
        res.status(500).json({ erro: "Erro ao buscar pedidos do banco de dados." });
    }
});

// Rota para criar um novo pedido no Supabase
app.post('/api/pedidos', async (req, res) => {
    const { nome, itens, total } = req.body;

    if (!nome || !itens) {
        return res.status(400).json({ erro: "Nome e itens são obrigatórios." });
    }

    try {
        const { data, error } = await supabase
            .from('pedidos')
            .insert([
                { nome, itens, total: total || "0.00", status: "Pendente" }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ sucesso: true, pedido: data[0] });
    } catch (error) {
        console.error("Erro ao criar pedido:", error.message);
        res.status(500).json({ erro: "Erro ao salvar o pedido no banco de dados." });
    }
});

// Rota para atualizar o status do pedido no Supabase
app.put('/api/pedidos/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const { data, error } = await supabase
            .from('pedidos')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }

        res.json({ sucesso: true, pedido: data[0] });
    } catch (error) {
        console.error("Erro ao atualizar status:", error.message);
        res.status(500).json({ erro: "Erro ao atualizar o status no banco de dados." });
    }
});

// Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}... Acesse em http://localhost:${PORT}`);
});
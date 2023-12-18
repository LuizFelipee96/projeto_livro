const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });


app.post('/processarLivro', upload.single('livro'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const tamanhoResumo = parseInt(req.body.tamanhoResumo) || 1;
    console.log("Tamanho do Resumo Recebido:", tamanhoResumo);

    try {
        const dataBuffer = await fs.readFile(req.file.path);
        const pdfData = await pdfParse(dataBuffer);

        const paginas = pdfData.text.split(/\f/);
        const textoResumo = paginas.slice(0, tamanhoResumo).join('\n\n');

        res.send(textoResumo);
    } catch (error) {
        res.status(500).send('Erro ao processar o livro: ' + error.message);
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

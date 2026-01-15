// criarFacturasCSV.js  (versão final - OBS limitado exatamente a 45 caracteres)
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

// =============== CONFIGURAÇÕES ==========================
const ARQUIVO_ENTRADA     = 'lista_alunos.csv';
const ARQUIVO_SAIDA       = 'facturas_geradas.csv';

const COLUNA_MATRICULA    = 'CODIGO_MATRICULA';
const COLUNA_PREINSCRICAO = 'PREINSCRICAO';

const URL_API_FACTURA     = 'http://192.168.30.45:3002/api/invoices/no-job';
const URL_API_DISCIPLINAS = 'http://192.168.30.45:3002/api/discipline';

const VALOR_MATRICULA      = 8500;
const VALOR_POR_DISCIPLINA = 2700;

const ANO_LECTIVO         = '23';
const SEMESTRE            = '1';

const DELAY_MS            = 10000;   // 10 segundos entre chamadas
const MAX_OBS_LENGTH      = 45;      // limite exato da coluna OBS na BD
// =======================================================

const caminhoEntrada = path.join(__dirname, ARQUIVO_ENTRADA);
const caminhoSaida   = path.join(__dirname, ARQUIVO_SAIDA);

console.log('📄 Lendo arquivo:', ARQUIVO_ENTRADA);

const registros = [];

fs.createReadStream(caminhoEntrada)
  .pipe(csv())
  .on('data', (linha) => registros.push(linha))
  .on('end', async () => {
    console.log(\nTotal de linhas lidas: ${registros.length});
    console.log('🚀 A criar faturas na API... (10s entre cada matrícula)\n');

    // Para testes: apenas 2 registos → depois muda para registros.length
    for (let i = 0; i < Math.min(500, registros.length); i++) {
      const reg = registros[i];

      const matricula    = (reg[COLUNA_MATRICULA]    || '').toString().trim();
      const preinscricao = (reg[COLUNA_PREINSCRICAO] || '').toString().trim();

      process.stdout.write(
        `Linha ${i + 1} → Mat: ${matricula.padEnd(10)} | Pré: ${preinscricao.padEnd(10)} → `
      );

      if (!matricula || !preinscricao || isNaN(Number(matricula)) || isNaN(Number(preinscricao))) {
        reg.STATUS_FACTURA = 'FALTA_DADOS';
        console.log('❌ Dados inválidos');
        continue;
      }

      let numDisciplinas = 0;
      let itensDisciplinas = [];

      try {
        // Buscar disciplinas
        const resDisc = await axios.get(URL_API_DISCIPLINAS, {
          params: {
            anoLectivo: ANO_LECTIVO,
            semestre: SEMESTRE,
            matriculaId: Number(matricula),
            page: 1,
            limit: 100
          },
          timeout: 10000
        });

        const disciplinas = resDisc.data?.data || [];
        numDisciplinas = disciplinas.length;

        itensDisciplinas = disciplinas.map(disc => {
          let nomeCompleto = disc.disciplina || disc.codigo_disciplina || 'Disciplina';

          const prefixo = 'Insc. ';
          let obs = prefixo + nomeCompleto;

          // Se ultrapassar 45 caracteres → corta o nome e adiciona ...
          if (obs.length > MAX_OBS_LENGTH) {
            const espacoParaNome = MAX_OBS_LENGTH - prefixo.length - 3; // -3 para ...
            const nomeCortado = nomeCompleto.substring(0, espacoParaNome);
            obs = prefixo + nomeCortado + '...';
          }

          // Garantia absoluta: nunca mais de 45
          obs = obs.substring(0, MAX_OBS_LENGTH);

          return {
            CodigoProduto: 11476,
            Quantidade: 1,
            preco: VALOR_POR_DISCIPLINA,
            Total: VALOR_POR_DISCIPLINA,
            valor_pago: 0,
            obs: obs,
            taxaIva: 1,
            valorIva: 0,
            retencao: 0,
            incidencia: 0,
            valorDesconto: 0,
            descontoProduto: 0,
            mes: "",
            multa: 0,
            estado: 0,
            valorPago: 0,
            valorATransportar: 0
          };
        });

        console.log(` (${numDisciplinas} disciplinas encontradas)`);

      } catch (errDisc) {
        console.log('⚠️ Falha ao buscar disciplinas →', errDisc.message);
        reg.STATUS_FACTURA = 'ERRO_DISCIPLINAS';
        reg.ERRO_DETALHE = errDisc.message || 'sem detalhe';
        continue;
      }

      const valorDisciplinas = numDisciplinas * VALOR_POR_DISCIPLINA;
      const totalPreco = VALOR_MATRICULA + valorDisciplinas;

      const payload = {
        polo_id: 1,
        TotalPreco: totalPreco,
        codigo_descricao: 101,
        ValorAPagar: totalPreco,
        total_incidencia: 0,
        total_retencao: 0,
        CodigoMatricula: Number(matricula),
        codigo_preinscricao: Number(preinscricao),
        Desconto: 0,
        totalIVA: 1,
        TotalMulta: 0,
        Descricao: "Matrícula + Inscrição em Disciplinas".substring(0, 44),
        tipo_documento_factura_id: 1,
        canal: 3,
        DataFactura: new Date().toISOString(),
        itens: [
          {
            CodigoProduto: 11511,
            Quantidade: 1,
            preco: VALOR_MATRICULA,
            Total: VALOR_MATRICULA,
            valor_pago: 0,
            obs: "Taxa Matrícula Licenciatura".substring(0, MAX_OBS_LENGTH),
            taxaIva: 1,
            valorIva: 0,
            retencao: 0,
            incidencia: 0,
            valorDesconto: 0,
            descontoProduto: 0,
            mes: "",
            multa: 0,
            mesTempId: 3,
            estado: 0,
            valorPago: 0,
            valorATransportar: 0
          },
          ...itensDisciplinas
        ]
      };

      // Debug opcional: ver o que está a ser enviado
      // console.log('Payload itens obs:', payload.itens.map(item => item.obs));

      try {
        const response = await axios.post(URL_API_FACTURA, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '/'
          },
          timeout: 20000
        });

        reg.STATUS_FACTURA   = 'OK';
        reg.ID_FACTURA       = response.data?.codigo || response.data?.id || 'sem_id';
        reg.NUMERO_FACTURA   = response.data?.numero || 'sem_numero';
        reg.QTD_DISCIPLINAS  = numDisciplinas;
        reg.VALOR_TOTAL      = totalPreco;

        console.log(✅ OK  (Total: ${totalPreco.toLocaleString('pt-AO')} - ${numDisciplinas} disc.));

      } catch (err) {
        reg.STATUS_FACTURA = 'ERRO';
        reg.ERRO_DETALHE =
          err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          'erro desconhecido';

        console.log('❌ ERRO');
        console.error('   →', reg.ERRO_DETALHE);
      }

      if (i < registros.length - 1) {
        console.log(`   ⏳ Aguardando ${DELAY_MS/1000}s...`);
        await new Promise(r => setTimeout(r, DELAY_MS));
      }
    }

    // =============================================
    // Gerar CSV de saída
    // =============================================
    const cabecalhos = [
      ...Object.keys(registros[0] || {}).map(key => ({ id: key, title: key })),
      { id: 'QTD_DISCIPLINAS', title: 'QTD_DISCIPLINAS' },
      { id: 'VALOR_TOTAL',     title: 'VALOR_TOTAL' },
      { id: 'STATUS_FACTURA',  title: 'STATUS_FACTURA' },
      { id: 'ID_FACTURA',      title: 'ID_FACTURA' },
      { id: 'NUMERO_FACTURA',  title: 'NUMERO_FACTURA' },
      { id: 'ERRO_DETALHE',    title: 'ERRO_DETALHE' }
    ].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

    const csvWriter = createObjectCsvWriter({
      path: caminhoSaida,
      header: cabecalhos,
      fieldDelimiter: ';',
      encoding: 'utf8'
    });

    await csvWriter.writeRecords(registros);

    console.log('\n=============================');
    console.log('✅ CONCLUÍDO!');
    console.log(📁 Arquivo gerado: ${ARQUIVO_SAIDA});
    console.log(📊 Total processado: ${registros.length} linhas);
    console.log('=============================\n');
  })
  .on('error', err => {
    console.error('Erro ao ler o CSV de entrada:', err.message);
  });

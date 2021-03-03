const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors')

const app = express();
app.use(cors())
const port = 3000;
const connStr = "Server=XXX.X.XXX.XX; Database=MEP; User id=user_btor; Password=xxxxxxxxxxx";


//conexao global
sql.connect(connStr)
    .then(conn => global.conn = conn)
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);
app.listen(port);
console.log('API Funcionou')

function execSQLQuery(sqlQry, res) {
    global.conn.request()
        .query(sqlQry)
        .then(result => res.json(result.recordset))
        .catch(err => res.json(err));
}
async function execSQL(res) {
    // const data = await global.conn.request().query('SELECT * FROM CAD200_CLIENTE')
    // .then(result => res.json(result.recordset))
    // .catch(err => res.json(err));
    const data = await global.conn.request().query('SELECT * FROM CAD200_CLIENTE')
    console.log(data.recordset)

}

router.get('/CAD200_CLIENTE/Get_IdProvedor/1', (req, res, next) => {
    execSQLQuery('SELECT * FROM CAD200_CLIENTE',
        res);
    console.log('success ')
})

router.get('/CAD200_CLIENTE/:id?', async (req, res) => {
    const dataB = await global.conn.query(`select * from CAD200_CLIENTE c
                                        inner join LKP203_CIDADE cd on c.idCidade = cd.idCidade
                                        where c.idCliente = ${req.params.id}`)
    var data = dataB.recordset[0]
    data['idCidade'] = data['idCidade'][0]
    return res.json(data)
})

router.post('/CAD200_CLIENTE/', (req, res) => {
    console.log(req.body)
    const idProvedor = req.body.idProvedor
    const razaoSocial = req.body.razaoSocial;
    const nomeFantasia = req.body.nomeFantasia;
    const cnpj = req.body.cnpj;
    const dataFundacao = req.body.dataFundacao;
    const porte = req.body.porte;
    const cnae = req.body.cnae;
    const dataCadastro = req.body.dataCadastro;
    const logradouro = req.body.logradouro;
    const endereco = req.body.endereco;
    const numero = req.body.numero;
    const bairro = req.body.bairro;
    const idCidade = req.body.idcidade;
    execSQLQuery(
        `INSERT INTO CAD200_CLIENTE(idProvedor, cnae, idCidade, razaoSocial, nomeFantasia, dataFundacao, dataCadastro, porte, logradouro, endereco, numero, bairro, CNPJ)
         VALUES(${idProvedor}, '${cnae}', ${idCidade}, '${razaoSocial}', '${nomeFantasia}', '${dataFundacao}', '${dataCadastro}', '${porte}', '${logradouro}', '${endereco}', '${numero}', '${bairro}', '${cnpj}' )`, res)
    console.log('cad_200-success')
})


router.delete('/CAD200_CLIENTE/:id', (req, res) => {
    execSQLQuery('DELETE FROM CAD200_CLIENTE WHERE idCliente=' + parseInt(req.params.id), res);
})


router.put('/CAD200_CLIENTE/:id', (req, res) => {
    console.log(req.body)
    const id = req.params.id;
    const razaoSocial = req.body.razaoSocial;
    const nomeFantasia = req.body.nomeFantasia;
    const cnpj = req.body.cnpj;
    const porte = req.body.porte;
    const cnae = req.body.cnae;
    const logradouro = req.body.logradouro;
    const endereco = req.body.endereco;
    const numero = req.body.numero;
    const bairro = req.body.bairro;
    const idCidade = req.body.idcidade;
    execSQLQuery(
        `UPDATE CAD200_CLIENTE 
        SET cnae='${cnae}'
        ,idCidade=${idCidade}
        ,razaoSocial='${razaoSocial}'
        ,nomeFantasia='${nomeFantasia}'
        ,porte='${porte}'
        ,idlogradouro='${logradouro}'
        ,endereco='${endereco}'
        ,numero='${numero}'
        ,bairro='${bairro}'
        ,CNPJ='${cnpj}' WHERE idCliente = ${id}`, res)
    console.log('UPDATE SUCCESS')
})


router.get('/LKP205_PORTE', (req, res, next) => {
    execSQLQuery('SELECT * FROM LKP205_PORTE',
        res);
    console.log('lkp205-success')
})

router.get('/LKP206_LOGRADOURO', (req, res, next) => {
    execSQLQuery('SELECT * FROM LKP206_LOGRADOURO',
        res);
    console.log('lkp206-success')
})

router.get('/LKP204_UF', (req, res, next) => {
    execSQLQuery('SELECT * FROM LKP204_UF',
        res);
    console.log('lkp204-success')
})

router.get('/LKP202_CNAE', (req, res, next) => {
    execSQLQuery('SELECT * FROM LKP202_CNAE',
        res);
    console.log('lkp202-success')
})

router.get('/CAD204_EMAIL/Get_idCliente/:id', (req, res, next) => {
    execSQLQuery(`SELECT * FROM CAD204_EMAIL where idCliente = ${req.params.id}`,
        res);
    console.log('cad_204-success');
})

router.get('/LKP203_CIDADE/Get_idUF/:id', async (req, res, next) => {
    const data = await global.conn.query(`select * from LKP203_CIDADE where idUF = ${req.params.id}`);
    res.json(data.recordset)
})


router.get('/api/CAD201_LICITACAO', async (req, res, next) => {
    var data = await global.conn.query('SELECT * FROM CAD001_LICITACAO');
    res.json(data.recordset)
})

router.get('/api/CAD201_LICITACAO/:id?', async (req, res) => {
    const dataB = await global.conn.query(`select * from CAD001_LICITACAO l
                                        inner join LKP203_CIDADE cd on l.idCidade = cd.idCidade
                                        where l.idLicitacao = ${req.params.id}`)
    var data = dataB.recordset[0]
    data['idCidade'] = data['idCidade'][0]
    return res.json(data)
})


router.get('/api/LKP003_MODALIDADE', async (req, res, next) => {
    const data = await global.conn.query('SELECT * FROM LKP003_MODALIDADE');
    res.json(data.recordset)
})


router.get('/api/LKP203_CIDADE', async (req, res, next) => {
    const data = await global.conn.query(`select * from LKP203_CIDADE`);
    res.json(data.recordset)
})

router.get('/api/LKP002_PLATAFORMA', async (req, res, next) => {
    const data = await global.conn.query(`select * from LKP002_PLATAFORMA`);
    res.json(data.recordset)
})

router.get('/api/LKP001_STATUS', async (req, res, next) => {
    const data = await global.conn.query(`select * from LKP001_STATUS_LICITACAO`);
    res.json(data.recordset)
})

router.get('/api/CAD200_CLIENTE/', async (req, res, next) => {
    const data = await global.conn.query(`select * from CAD200_CLIENTE`);
    res.json(data.recordset)
})
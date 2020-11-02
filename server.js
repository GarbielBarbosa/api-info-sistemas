const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs');
const Vehicle = require("./models/vehicle");
const { check, validationResult } = require('express-validator');
const plateHelper = require("./helper/plate.helper")

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json({ extended: true }))

app.listen(3000, function() {
    console.log('server running on port 3000')
})

app.post('/vehicle', [
    check('placa').custom(placa => {
        if (plateHelper.validatePlate(placa)) {
            return new Error('Invalid placa')
        }
    }),
    check('chassi').notEmpty(),
    check('renavam').notEmpty(),
    check('modelo').notEmpty(),
    check('marca').notEmpty(),
    check('ano').custom(ano => {
        if ((ano >= 1886 && ano <= 2020)) {
            return new Error('Invalid Ano')
        }
    }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) res.status(500).json({ message: "Erro ao ler o arquivo" });


        let obj = JSON.parse(data);
        const vehicle = new Vehicle(req.body)
        obj.vehicles.push(vehicle);
        fs.writeFile("data.json", JSON.stringify(obj), function(err) {
            if (err) res.status(500).json({ message: "Erro ao salvar o arquivo" });
            res.status(201).json(vehicle);
        });
    });
});

app.get('/vehicle/:id', (req, res) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) res.status(500).json({ message: "Erro ao ler o arquivo" });

        let obj = JSON.parse(data);
        let find = obj.vehicles.find(vehicle => { return vehicle.id == req.params.id });
        if (find)
            res.status(200).json(find);
        else
            res.status(204).json({ message: "Veículo não encontrado" });

    });
});

app.get('/vehicle', (req, res) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) res.status(500).json({ message: "Erro ao ler o arquivo" });
        let obj = JSON.parse(data);
        res.status(200).json(obj.vehicles);
    });
});

app.post('/vehicle/pagination', [
    check('page').notEmpty().isNumeric(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) res.status(500).json({ message: "Erro ao ler o arquivo" });
        let obj = JSON.parse(data);

        let novoArray = []
        let corte = 10;

        for (var i = 0; i < obj.vehicles.length; i = i + corte) {
            novoArray.push(obj.vehicles.slice(i, i + corte));
        }

        res.status(200).json({
            currentPage: req.body.page,
            data: novoArray[req.body.page - 1],
            size: obj.vehicles.length,
        });
    });
});




app.put('/vehicle', [
    check('id').notEmpty(),
    check('placa').custom(placa => {
        if (plateHelper.validatePlate(placa)) {
            return new Error('Invalid placa')
        }
    }),
    check('chassi').notEmpty(),
    check('renavam').notEmpty(),
    check('modelo').notEmpty(),
    check('marca').notEmpty(),
    check('ano').custom(ano => {
        if ((ano >= 1886 && ano <= 2020)) {
            return new Error('Invalid Ano')
        }
    }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) res.status(500).json({ message: "Erro ao ler o arquivo" });
        let vehicle = new Vehicle(req.body);
        let obj = JSON.parse(data);
        let status = false;
        obj.vehicles = obj.vehicles.map((c) => {
            if (c.id === vehicle.id) {
                status = true;
                return c = vehicle;
            } else
                return c
        });

        if (status) {
            fs.writeFile("data.json", JSON.stringify(obj), function(err) {
                if (err) throw res.status(500).json({ message: "Erro ao salvar o arquivo" });
                res.status(200).json(null);
            });
        } else
            res.status(204).json({ message: "Veículo não encontrado" });

    });
});

app.delete('/vehicle/:id', (req, res) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) throw res.status(500).json({ message: "Erro ao ler o arquivo" });

        let obj = JSON.parse(data);
        let find = false;

        find = obj.vehicles.splice(obj.vehicles.find(a => { a.id === req.params.id }), 1)

        if (find) {
            fs.writeFile("data.json", JSON.stringify(obj), function(err) {
                if (err) throw res.status(500).json({ message: "Erro ao salvar o arquivo" });
                res.status(200).json();
            });
        } else
            res.status(400).json({ message: "Veículo não encontrado" });

    });
});

module.exports = { app }
const chai = require('chai');
const http = require('chai-http');
const subSet = require('chai-subset');

const index = require('../server');

chai.use(http);
chai.use(subSet);

const vehicleSchema = {
    id: id => id,
    placa: placa => placa,
    chassi: chassi => chassi,
    renavam: renavam => renavam,
    modelo: modelo => modelo,
    marca: marca => marca,
    ano: ano => ano,
};

const validId = 1604285918602

describe('Testes de integração', () => {



    it('/vehicle - GET - LIST', () => {
        chai.request(index.app)
            .get('/vehicle')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.containSubset([vehicleSchema]);
            });
    });

    it('/vehicle/:id - GET ONE ', () => {
        chai.request(index.app)
            .get('/vehicle/' + validId)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.containSubset(vehicleSchema);
            });
    });

    it('/vehicle/:id - (Invalid Id) - GET ONE', () => {
        chai.request(index.app)
            .get('/vehicle/5')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(204);
            });
    });

    it('Create /vehicle - POST', () => {
        chai.request(index.app)
            .post('/vehicle')
            .send({
                ano: 2020,
                chassi: "123123123",
                marca: "Chevrolet",
                modelo: "Oniex",
                placa: "php2507",
                renavam: "123123",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);
                chai.expect(res.body).to.containSubset(vehicleSchema);
            });
    });

    it('Create /vehicle (invalid ANO) - POST', () => {
        chai.request(index.app)
            .post('/vehicle')
            .send({
                ano: 2,
                chassi: "123123123",
                marca: "Chevrolet",
                modelo: "Oniex",
                placa: "php2507",
                renavam: "123123",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    it('Create /vehicle (invalid Placa) - POST', () => {
        chai.request(index.app)
            .post('/vehicle')
            .send({
                ano: 2020,
                chassi: "123123123",
                marca: "Chevrolet",
                modelo: "Oniex",
                placa: "8555",
                renavam: "123123",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.not.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    it('Create /vehicle (No send data) - POST', () => {
        chai.request(index.app)
            .post('/vehicle')
            .send({})
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    it('Create /vehicle (Send invalid Data) - POST', () => {
        chai.request(index.app)
            .post('/vehicle')
            .send({
                ano: 2020,
                chassi: "",
                marca: "",
                modelo: "",
                placa: "hmf2578",
                renavam: "",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    it('Update /vehicle - PUT', () => {
        chai.request(index.app)
            .put('/vehicle')
            .send({
                id: validId,
                ano: 2020,
                chassi: "123123123",
                marca: "Chevrolet",
                modelo: "Oniex",
                placa: "php2507",
                renavam: "123123",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.null;
            });
    });

    it('Update /vehicle - (invalid ID) - PUT', () => {
        chai.request(index.app)
            .put('/vehicle')
            .send({
                id: 0,
                ano: 2020,
                chassi: "123123123",
                marca: "Chevrolet",
                modelo: "Oniex",
                placa: "php2507",
                renavam: "123123",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(204);
            });
    });

    it('Update /vehicle - (No send ID) - PUT', () => {
        chai.request(index.app)
            .put('/vehicle')
            .send({
                ano: 2020,
                chassi: "123123123",
                marca: "Chevrolet",
                modelo: "Oniex",
                placa: "php2507",
                renavam: "123123",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    it('Update /vehicle (invalid ANO) - PUT', () => {
        chai.request(index.app)
            .put('/vehicle')
            .send({
                id: validId,
                ano: 2,
                chassi: "123123123",
                marca: "Chevrolet",
                modelo: "Oniex",
                placa: "php2507",
                renavam: "123123",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.not.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    it('Update /vehicle (invalid Placa) - PUT', () => {
        chai.request(index.app)
            .put('/vehicle')
            .send({
                id: validId,
                ano: 2020,
                chassi: "123123123",
                marca: "Chevrolet",
                modelo: "Oniex",
                placa: "8555",
                renavam: "123123",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.not.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    it('Update /vehicle (No send data) - PUT', () => {
        chai.request(index.app)
            .put('/vehicle')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.not.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    it('Update /vehicle (Send invalid Data) - PUT', () => {
        chai.request(index.app)
            .put('/vehicle')
            .send({
                id: validId,
                ano: 2020,
                chassi: "",
                marca: "",
                modelo: "",
                placa: "hmf2578",
                renavam: "",
            })
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.not.be.null;
                chai.expect(res).to.have.status(400);
            });
    });

    // it('Delete /vehicle - PUT', () => {
    //     chai.request(index.app)
    //         .delete('/vehicle/1604285918602')
    //         .end((err, res) => {
    //             chai.expect(err).to.be.null;
    //             chai.expect(res).to.have.status(200);
    //         });
    // });

    it('Delete /vehicle/:id - (Invalid Id) - DELETE', () => {
        chai.request(index.app)
            .get('/vehicle/5')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(204);
            });
    });


})
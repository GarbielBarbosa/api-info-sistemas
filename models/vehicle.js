module.exports = class Vehicle {
    //propriedades e funções da classe aqui

    constructor(other) {
        if (other != null) {
            this.id = other.id ? other.id : new Date().getTime();
            this.placa = other.placa;
            this.chassi = other.chassi;
            this.renavam = other.renavam;
            this.modelo = other.modelo;
            this.marca = other.marca;
            this.ano = other.ano;
        }
    }

}
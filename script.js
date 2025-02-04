const app = Vue.createApp({
  data() {
    return {
      salario: null,
      isss: 0,
      afp: 0,
      renta: 0,
      liquido: 0,
      isssPatronal: 0,
      afpPatronal: 0,
      totalRetenciones: 0,
      totalPatronal: 0,
      irsTotal: 0,
      tramoAplicado: null,
      mostrarResultados: false,
    };
  },
  computed: {
    salarioLimitado() {
      return Math.min(this.salario || 0, 1000);
    },
  },
  methods: {
    calcular() {
      if (!this.salario || this.salario <= 0) {
        alert("Ingrese un salario válido.");
        this.mostrarResultados = false;
        return;
      }

      // Deducciones del empleado
      this.isss = this.salarioLimitado * 0.03;
      this.afp = this.salario * 0.0725;
      this.irsTotal = this.salario - this.isss - this.afp;

      // Calcular renta con IRS
      this.renta = this.calcularRenta(this.irsTotal);

      this.totalRetenciones = this.isss + this.afp + this.renta;
      this.liquido = this.salario - this.totalRetenciones;

      // Aportes patronales
      this.isssPatronal = this.salarioLimitado * 0.075;
      this.afpPatronal = this.salario * 0.0875;
      this.totalPatronal = this.isssPatronal + this.afpPatronal;

      this.mostrarResultados = true;
    },
    calcularRenta(irsTotal) {
      const tramos = [
        {
          desde: 0.01,
          hasta: 472.0,
          porcentaje: 0,
          excedente: 0,
          cuotaFija: 0,
          descripcion: "Sin retención",
        },
        {
          desde: 472.01,
          hasta: 895.24,
          porcentaje: 0.1,
          excedente: 472.0,
          cuotaFija: 17.67,
          descripcion: "Tramo 2 (10%)",
        },
        {
          desde: 895.25,
          hasta: 2038.1,
          porcentaje: 0.2,
          excedente: 895.24,
          cuotaFija: 60.0,
          descripcion: "Tramo 3 (20%)",
        },
        {
          desde: 2038.11,
          hasta: Infinity,
          porcentaje: 0.3,
          excedente: 2038.1,
          cuotaFija: 288.57,
          descripcion: "Tramo 4 (30%)",
        },
      ];

      const tramo = tramos.find(
        (t) => irsTotal >= t.desde && irsTotal <= t.hasta
      );
      if (tramo) {
        this.tramoAplicado = tramo.descripcion;
        return (
          (irsTotal - tramo.excedente) * tramo.porcentaje + tramo.cuotaFija
        );
      }

      this.tramoAplicado = "No Aplica";
      return 0;
    },
    formatoMoneda(valor) {
      return new Intl.NumberFormat("es-SV", {
        style: "currency",
        currency: "USD",
      }).format(valor);
    },
  },
});

app.mount("#app");

// Hecho por y para Dimas (Por: @Izauwu)

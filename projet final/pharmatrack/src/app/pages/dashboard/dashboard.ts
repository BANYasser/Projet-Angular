import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { MedicineService } from '../../services/medicine';
import { SaleService } from '../../services/sale';
import { Medicine } from '../../Interfaces/medicine.model';
import { Sale } from '../../Interfaces/sale.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, AfterViewInit {
  // Injection des services
  private medicineService = inject(MedicineService);
  private saleService = inject(SaleService);

  // Propriétés pour stocker les données
  lowStockMedicines: Medicine[] = [];
  todaysRevenue = 0;
  todaysSalesCount = 0;

  // Propriétés pour les données des graphiques
  salesByMonthData: { name: string, value: number }[] = [];
  salesByMedicineData: { name: string, value: number }[] = [];

  // États de chargement et d'erreur
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    // On utilise forkJoin pour lancer les deux appels en parallèle
    forkJoin({
      medicines: this.medicineService.getMedicines(),
      sales: this.saleService.getSales()
    }).subscribe({
      next: ({ medicines, sales }) => {
        // 1. Calcul des médicaments en rupture de stock
        this.lowStockMedicines = medicines.filter(med => med.stock < 10);

        // 2. Calcul des statistiques du jour
        this.calculateTodayStats(sales);

        // 3. Préparation des données pour les graphiques
        this.prepareSalesByMonth(sales);
        this.prepareSalesByMedicine(sales);

        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des données du tableau de bord.';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    // On attend que les données soient chargées avant de dessiner les graphiques
    if (!this.isLoading) {
      this.createBarChart();
      this.createPieChart();
    } else {
      // Si les données ne sont pas encore prêtes, on attend la fin du chargement
      const subscription = forkJoin({
        medicines: this.medicineService.getMedicines(),
        sales: this.saleService.getSales()
      }).subscribe(() => {
        this.createBarChart();
        this.createPieChart();
        subscription.unsubscribe(); // On se désabonne pour éviter les fuites mémoire
      });
    }
  }

  private calculateTodayStats(sales: Sale[]) {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    const todaySales = sales.filter(sale => sale.date === today);

    this.todaysSalesCount = todaySales.length;
    this.todaysRevenue = todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  }

  private prepareSalesByMonth(sales: Sale[]) {
    const monthlySales: { [key: string]: number } = {};
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

    sales.forEach(sale => {
      const month = new Date(sale.date).getMonth(); // 0-11
      const year = new Date(sale.date).getFullYear();
      const key = `${monthNames[month]} ${year}`;

      if (!monthlySales[key]) {
        monthlySales[key] = 0;
      }
      monthlySales[key] += sale.totalPrice;
    });

    this.salesByMonthData = Object.keys(monthlySales).map(key => ({
      name: key,
      value: monthlySales[key]
    }));
  }

  private prepareSalesByMedicine(sales: Sale[]) {
    const medicineSales: { [key: string]: number } = {};

    sales.forEach(sale => {
      const key = sale.medicineName;
      if (!medicineSales[key]) {
        medicineSales[key] = 0;
      }
      medicineSales[key] += sale.totalPrice;
    });

    this.salesByMedicineData = Object.keys(medicineSales).map(key => ({
      name: key,
      value: medicineSales[key]
    }));
  }

  private createBarChart() {
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.salesByMonthData.map(d => d.name),
        datasets: [{
          label: 'Ventes par mois (XOF)',
          data: this.salesByMonthData.map(d => d.value),
          backgroundColor: 'rgba(76, 175, 80, 0.6)',
        }]
      }
    });
  }

  private createPieChart() {
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: this.salesByMedicineData.map(d => d.name),
        datasets: [{
          label: 'Répartition par produit',
          data: this.salesByMedicineData.map(d => d.value),
        }]
      }
    });
  }
}

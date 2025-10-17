import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale';
import { Sale } from '../../Interfaces/sale.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-list',
  imports: [DatePipe, CurrencyPipe, CommonModule],
  standalone: true,
  templateUrl: './sales-list.html',
  styleUrl: './sales-list.scss'
})
export class SalesList implements OnInit {
  sales: Sale[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit() {
    this.fetchSales();
  }

  fetchSales() {
    this.isLoading = true;
    this.error = null;
    this.saleService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = "Erreur lors du chargement des ventes.";
        this.isLoading = false;
      }
    });
  }

  addSale() {
    this.router.navigate(['/sales/new']);
  }

  editSale(sale: any) {
    this.router.navigate(['/sales/edit', sale.id]);
  }

  deleteSale(id: number) {
    this.saleService.deleteSale(id).subscribe(() => this.fetchSales());
  }

  get totalJournalier(): number {
    const today = new Date().toISOString().substring(0, 10);
    return this.sales
      .filter(sale => sale.date.startsWith(today))
      .reduce((sum, sale) => sum + sale.totalPrice, 0);
  }
}

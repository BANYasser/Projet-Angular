import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../Interfaces/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private base = 'http://localhost:3000/sales';

  constructor(private http: HttpClient) { }

  getSales(): Observable<Sale[]> {
    // Récupère toutes les ventes, triées par date la plus récente en premier
    return this.http.get<Sale[]>(`${this.base}?_sort=date&_order=desc`);
  }

  getSaleById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.base}/${id}`);
  }

  createSale(sale: Omit<Sale, 'id'>): Observable<Sale> {
    return this.http.post<Sale>(this.base, sale);
  }

  updateSale(id: number, sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.base}/${id}`, sale);
  }

  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}

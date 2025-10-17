import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine } from '../Interfaces/medicine.model';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private base = 'http://localhost:3000/medicines'; // json-server

  constructor(private http: HttpClient) {}

  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.base);
  }

  getMedicine(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.base}/${id}`);
  }

  createMedicine(med: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.base, med);
  }

  updateMedicine(id: number, med: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.base}/${id}`, med);
  }

  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getLowStock(threshold = 10): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.base}?quantity_lte=${threshold}`);
  }
}

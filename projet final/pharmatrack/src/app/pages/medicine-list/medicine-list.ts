import { Component, OnInit } from '@angular/core';
import { Medicine } from '../../Interfaces/medicine.model';
import { MedicineService } from '../../services/medicine';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-medicine-list',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  standalone: true,
  templateUrl: './medicine-list.html',
   styleUrl: './medicine-list.scss'
})
export class MedicineListComponent implements OnInit {
  medicines: Medicine[] = [];
  isLoading = true;
  error: string | null = null;
  filter = '';
  isAdmin = false;

  constructor(
    private medSvc: MedicineService,
    private authSvc: AuthService,
    private router: Router
  ) { this.isAdmin = this.authSvc.getUserRole() === 'admin'; }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.medSvc.getMedicines().subscribe({
      next: (data) => { this.medicines = data; this.isLoading = false; },
      error: (err) => { this.error = 'Erreur de chargement'; this.isLoading = false; }
    });
  }

  delete(id?: number) {
    if (!id) return;
    if (!confirm('Voulez-vous supprimer cet article ?')) return;
    this.medSvc.deleteMedicine(id).subscribe(() => this.load());
  }

  edit(id?: number) {
    if (!id) return;
    this.router.navigate(['/medicines/edit', id]);
  }

  add() {
    this.router.navigate(['/medicines/new']);
  }

  get filteredMedicines() {
    if (!this.filter) return this.medicines;
    return this.medicines.filter(m =>
      m.name.toLowerCase().includes(this.filter.toLowerCase())
    );
  }
}

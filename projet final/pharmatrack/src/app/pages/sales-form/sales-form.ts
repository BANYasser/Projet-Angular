import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaleService } from '../../services/sale';
import { MedicineService } from '../../services/medicine';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.html',
  styleUrl: './sales-form.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SalesFormComponent implements OnInit {
  selectedSale: any = null;

  delete() {
    if (!this.selectedSale) return;
    this.saleService.deleteSale(this.selectedSale.id).subscribe({
      next: () => {
        this.selectedSale = null;
        this.router.navigate(['/sales']);
      },
      error: () => this.error = "Erreur lors de la suppression de la vente."
    });
  }

  form: FormGroup;
  medicines: any[] = [];
  error: string | null = null;
  dailyTotal: number = 0; // Initialize to 0 or your desired default

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private medicineService: MedicineService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      medicineId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  ngOnInit() {
    this.medicineService.getMedicines().subscribe({
      next: (data) => this.medicines = data,
      error: () => this.error = "Erreur lors du chargement des médicaments."
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.saleService.getSaleById(+id).subscribe(sale => {
        this.selectedSale = sale;
        this.form.patchValue({
          medicineId: sale.medicineId,
          quantity: sale.quantity,
          date: sale.date
        });
      })
    }
  }

  submit() {
    if (this.form.invalid) return;
    const { medicineId, quantity, date } = this.form.value;
    const selectedMedicine = this.medicines.find(m => m.id === medicineId);

    if (!selectedMedicine || selectedMedicine.stock < quantity) {
      this.error = "Stock insuffisant pour cette vente.";
      return;
    }

    const saleData = {
      medicineId,
      medicineName: selectedMedicine.name,
      quantity,
      date,
      totalPrice: selectedMedicine.price * quantity
    };

    if (this.selectedSale) {
      // C'est ici qu'on gère la MODIFICATION
      this.saleService.updateSale(this.selectedSale.id, { ...this.selectedSale, ...saleData }).subscribe({
        next: () => {
          this.selectedSale = null; // Réinitialisation de l'état
          this.router.navigate(['/sales']);
        },
        error: () => this.error = "Erreur lors de la modification de la vente."
      });
    } else {
      // C'est ici qu'on gère la CRÉATION
      this.saleService.createSale(saleData).subscribe({
        next: () => {
          this.medicineService.updateMedicine(
            selectedMedicine.id,
            { ...selectedMedicine, stock: selectedMedicine.stock - quantity }
          ).subscribe({
            next: () => this.router.navigate(['/sales']),
            error: () => this.error = "Vente enregistrée, mais erreur lors de la mise à jour du stock."
          });
        },
        error: () => this.error = "Erreur lors de l'enregistrement de la vente."
      });
    }
  }

  close() {
    this.router.navigate(['/sales']);
  }
}

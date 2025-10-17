import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService } from '../../services/medicine';
import { Medicine } from '../../Interfaces/medicine.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-medicine-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './medicine-form.html',
  standalone: true,
  styleUrl: './medicine-form.scss'
})
export class MedicineFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  id?: number;
  pageTitle = 'Ajouter un médicament';

  constructor(
    private fb: FormBuilder,
    private medSvc: MedicineService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.pageTitle = 'Modifier le médicament';
      this.medSvc.getMedicine(this.id).subscribe(med => this.form.patchValue(med));
    }
  }

  submit() {
    if (this.form.invalid) return;
    // On s'assure que la valeur est bien du type Medicine, car la validation est passée.
    const value = this.form.value as Medicine;

    if (this.isEdit && this.id) {
      // On s'assure que l'ID est bien inclus dans l'objet envoyé au serveur
      const updatedMedicine: Medicine = {
        ...value,
        id: this.id
      };
      this.medSvc.updateMedicine(this.id, updatedMedicine).subscribe(() => this.router.navigate(['/medicines']));
       }

     else {
      this.medSvc.createMedicine(value).subscribe(() => this.router.navigate(['/medicines']));
    }
  }

  close() {
    this.router.navigate(['/medicines']);
  }
}

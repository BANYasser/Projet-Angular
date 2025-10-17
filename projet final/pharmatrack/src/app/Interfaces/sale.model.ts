export interface Sale {
  id: number;
  medicineId: number;
  medicineName: string; // Nom du médicament au moment de la vente
  quantity: number;
  totalPrice: number;
  date: string; // La date de la vente au format ISO (ex: "2023-10-27T10:00:00Z")
}


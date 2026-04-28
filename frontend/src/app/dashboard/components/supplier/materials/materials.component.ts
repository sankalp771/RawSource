import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../services/supplier.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-materials',
  standalone: false,
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.css'
})
export class MaterialsComponent implements OnInit {
  materials: any[] = [];
  isLoading = true;
  errorMessage = '';

  isModalOpen = false;
  isSaving = false;
  
  materialForm = new FormGroup({
    materialName: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    unit: new FormControl('kg', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  private currentSupplierId: number | null = null;

  constructor(
    private supplierService: SupplierService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentSupplierId = user?.supplierId;

    if (this.currentSupplierId) {
      this.fetchMaterials(this.currentSupplierId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Supplier information not found. Please log in as a Supplier.';
    }
  }

  fetchMaterials(id: number): void {
    this.isLoading = true;
    this.supplierService.getInventorySummary(id).subscribe(
      (data) => {
        this.materials = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load your material catalog.';
        console.error('Error fetching materials:', error);
      }
    );
  }

  openModal() {
    this.materialForm.reset({ quantity: 0, unit: 'kg', price: 0 });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.materialForm.invalid || !this.currentSupplierId) return;

    this.isSaving = true;
    const formVals = this.materialForm.value;

    const newMaterial = {
      name: formVals.materialName,
      description: formVals.description || ''
    };

    // 1. Create Raw Material
    this.supplierService.createRawMaterial(newMaterial).subscribe(
      (savedMaterial) => {
        
        // 2. Link it to the Supplier via Availability (Stock)
        const availability = {
          material: { materialId: savedMaterial.materialId },
          supplier: { supplierId: this.currentSupplierId },
          quantity: formVals.quantity,
          unit: formVals.unit
        };

        // 3. Link it via Pricing
        const pricing = {
          material: { materialId: savedMaterial.materialId },
          supplier: { supplierId: this.currentSupplierId },
          price: formVals.price,
          validFrom: new Date().toISOString().split('T')[0],
          validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] // 1 year out
        };

        this.supplierService.createAvailability(availability).subscribe(
          () => {
            this.supplierService.createPricing(pricing).subscribe(
              () => {
                this.isSaving = false;
                this.closeModal();
                this.fetchMaterials(this.currentSupplierId!);
              },
              (pricingErr) => {
                this.isSaving = false;
                alert('Failed to save material pricing.');
                console.error(pricingErr);
              }
            );
          },
          (err) => {
            this.isSaving = false;
            alert('Failed to save availability stock.');
            console.error(err);
          }
        );
      },
      (err) => {
        this.isSaving = false;
        alert('Failed to create raw material.');
        console.error(err);
      }
    );
  }
}

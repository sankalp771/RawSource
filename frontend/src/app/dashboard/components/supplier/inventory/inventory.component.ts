import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { SupplierService } from '../../../services/supplier.service';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  inventoryData: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private supplierService: SupplierService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const supplierId = user?.supplierId;

    if (supplierId) {
      this.loadCombinedData(supplierId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Supplier session not found.';
    }
  }

  loadCombinedData(id: number): void {
    this.supplierService.getInventorySummary(id).subscribe({
      next: (result) => {
        this.inventoryData = result;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to sync inventory and pricing modules. Check connection.';
        console.error('Supplier data error:', err);
      }
    });
  }

  onSave(item: any): void {
    const availabilityPayload = {
      quantity: item.quantity,
      unit: item.unit
    };

    const pricingPayload = {
      price: item.price,
      validFrom: item.validFrom,
      validTo: item.validTo
    };

    forkJoin({
      availability: this.supplierService.updateAvailability(item.availId, availabilityPayload),
      pricing: item.pricingId ? this.supplierService.updatePricing(item.pricingId, pricingPayload) : of(null)
    }).subscribe({
      next: () => {
        alert('Changes for material saved successfully!');
      },
      error: (err) => {
        alert('Failed to save changes. Please try again.');
        console.error('Update error:', err);
      }
    });
  }
}


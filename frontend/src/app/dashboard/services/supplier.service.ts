import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Get raw materials for the supplier
  getMaterials(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suppliers/${supplierId}/materials`);
  }

  getInventorySummary(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suppliers/${supplierId}/inventory`);
  }

  getAvailability(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suppliers/${supplierId}/availability`);
  }

  getPricing(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suppliers/${supplierId}/pricing`);
  }

  getContracts(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suppliers/${supplierId}/contracts`);
  }

  updateAvailability(availId: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/availabilities/${availId}`, payload);
  }

  createRawMaterial(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/raw-materials`, payload);
  }

  createAvailability(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/availabilities`, payload);
  }

  createPricing(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pricings`, payload);
  }

  updatePricing(pricingId: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/pricings/${pricingId}`, payload);
  }
}

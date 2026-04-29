import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all raw materials available for purchase
  getAllMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/raw-materials`);
  }

  // Get ratings for a specific material
  getMaterialRatings(materialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/raw-materials/${materialId}/ratings`);
  }

  // Get marketplace listings (Option B)
  getListings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/marketplace/listings`);
  }

  // Purchase directly from a supplier
  purchase(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/marketplace/purchase`, payload);
  }
}

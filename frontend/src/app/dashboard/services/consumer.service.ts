import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all orders for the logged-in consumer
  getOrders(consumerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consumers/${consumerId}/orders`);
  }

  // Get detailed items for a specific order
  getOrderItems(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/${orderId}/items`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from 'app/shared/models/service.model';
import { Provider } from 'app/shared/models/provider.model';
import { Category } from 'app/shared/models/category.model';
import { CategoryService } from 'app/shared/services/category.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://127.0.0.1:8000/api/services';

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/approved`);
  }

  getServiceByCategory(id: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/category/${id}`);
  }

  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.categoryService.getCategories();
  }

  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/providers`);
  }

  addService(serviceData: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Service data:', serviceData);
    return this.http.post(this.apiUrl + '/add/', serviceData, { headers });
  }
}

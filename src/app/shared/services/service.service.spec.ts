import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from 'app/shared/models/service.model';
import { Provider } from 'app/shared/models/provider.model';
import { Category } from 'app/shared/models/category.model';
import { CategoryService } from 'app/shared/services/category.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

 getServicesByCategory(categoryId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/category/${categoryId}`);
 }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}`);
  }

  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  // Usa o CategoryService para buscar as categorias
  getCategories(): Observable<Category[]> {
    return this.categoryService.getCategories();
  }

  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/providers`);
  }

  // Adicionar um novo serviço
  addService(serviceData: FormData): Observable<any> {
    const token = localStorage.getItem('accessToken'); // Ou onde o token está armazenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Service data:', serviceData);
    return this.http.post(this.apiUrl + '/add/', serviceData, { headers });
  }
}

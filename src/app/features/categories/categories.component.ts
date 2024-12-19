import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-categories',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  private categoriesUrl = `${environment.apiUrl}/categories/`;
  private categoriesAddUrl = `${environment.apiUrl}/categories/add/`;
  categories: any[] = [];

  private token = localStorage.getItem('accessToken');

  categoryName: any;
  categoryDescription: any;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    });
    this.http.get<any[]>(this.categoriesUrl, {headers}).subscribe({
      next: (data: any[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Erro ao buscar as categorias:', error);
      },
    });
  }

  addCategory(): void {
    if (!this.token) {
      console.error('Token de autenticação não encontrado!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    this.http.post(this.categoriesAddUrl, { name: this.categoryName, description: this.categoryDescription }, {headers}).subscribe({
      next: () => {
        console.log('Categoria adicionada com sucesso!');
        this.fetchCategories();
      },
      error: (error) => {
        console.error('Erro ao adicionar a categoria:', error);
      }
    });
  }
}

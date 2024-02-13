import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  queryParams: any;
  constructor(private http: HttpClient) { }


  fetchQueryParams() {
    const url = `api/query-params`;
    return this.http.get<any>(url);
  }
}

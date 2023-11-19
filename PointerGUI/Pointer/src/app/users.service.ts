import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceCustom {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient
  ) { }

  public getAllRestaurants(): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/getAllRestaurants`);
  }
  public getAllPointed(): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/getAllPointed`);
  }
  public getAllUnPointed(): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/getAllUnPointed`);
  }
  public checkCodeAndSubmitAction(details: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/submit`, details);
  }
  public createNewUser(details: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/createUser`, details);
  }
  public createNewRestaurant(details: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/createRestaurant`, details);
  }
}

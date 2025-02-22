import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceCustom {
  private apiUrl = 'http://localhost:8080/api'; //'https://pointer-tracker.onrender.com/api';

  constructor(
    private http: HttpClient
  ) { }

  public getAllVehicles(): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/getAllVehicles`);
  }
  public getAllRestaurants(): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/getAllRestaurants`);
  }
  public getAllUsers(): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/getAllUsers`);
  }
  public getAllPointed(restaurantId: string): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/getAllPointed/${restaurantId}`);
  }
  public getAllUnPointed(): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/getAllUnPointed`);
  }
  public checkCodeAndSubmitAction(details: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/submit`, details);
  }
  public updateUsedVehicle(docId: string, vhecileId: string): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/selectedVehicle/${docId}/${vhecileId}`);
  }
  public createNewUser(details: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/createUser`, details);
  }
  public deleteUserById(id: any): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/deleteUserById/${id}`);
  }
  public createNewVehicle(details: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/createVehicle`, details);
  }
  public createNewRestaurant(details: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/createRestaurant`, details);
  }
  public deleteRestaurantById(id: any): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/deleteRestaurantById/${id}`);
  }
  public deleteVehicleById(id: any): Observable<any> {
    return this.http.get<{ response: any }>(`${this.apiUrl}/deleteVehicleById/${id}`);
  }
  public getAllFromTo(details: any): Observable<any> {
    return this.http.post<{ response: any }>(`${this.apiUrl}/getAllFromTo`, details);
  }
}

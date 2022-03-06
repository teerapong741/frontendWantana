import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private baseUrl: string = 'https://thaiaddressapi-thaikub.herokuapp.com/';

  constructor(private readonly http: HttpClient) {}

  provinces(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'v1/thailand/provinces');
  }

  districtsOfProvince(province: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + `v1/thailand/provinces/${province}/district`
    );
  }

  subDistrictsOfDistrict(province: string, district: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + `v1/thailand/provinces/${province}/district/${district}`
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  AUTH_URL = 'http://localhost:3000/auth';
  PAYMENT_URL = 'http://localhost:3001/api/payments';
  BOOKING_BASE_URL =
    'https://booking-service.cfapps.eu12.hana.ondemand.com/api/bookings';
  HOTL_SERVICE_URL =
    'https://hotel-service-1.cfapps.eu12.hana.ondemand.com/api/hotels';
  BOOKING_SERVICE_URL =
    'https://booking-service.cfapps.eu12.hana.ondemand.com/api/bookings';

  authToken = localStorage.getItem('authToken');
  constructor(private readonly http: HttpClient) {}

  verifyUser() {
    return this.http.post(`${this.AUTH_URL}/verify`, this.createHeaders());
  }

  registerUser(payload: any) {
    return this.http.post(`${this.AUTH_URL}/register`, payload);
  }

  loginUser(payload: any) {
    return this.http.post(`${this.AUTH_URL}/login`, payload);
  }

  getHotels() {
    this.createHeaders();
    return this.http.get(`${this.HOTL_SERVICE_URL}`, {
      headers: this.createHeaders(),
    });
  }

  createHeaders() {
    const header = { Authorization: `Bearer ${this.authToken}` };
    console.log(header);

    return header;
  }
}

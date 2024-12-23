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
  ROOM_SERVICE_URL =
    'https://room-service.cfapps.eu12.hana.ondemand.com/api/rooms';
  PAYMENTS_SERVICE_URL =
    'https://payment-service.cfapps.us10-001.hana.ondemand.com/api/payments';

  authToken = localStorage.getItem('authToken');
  constructor(private readonly http: HttpClient) {}

  verifyUser() {
    return this.http.post(
      `${this.AUTH_URL}/verify`,
      {},
      {
        headers: this.createHeaders(),
      }
    );
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

  getHotelById(hotelId: string) {
    return this.http.get(`${this.HOTL_SERVICE_URL}/${hotelId}`, {
      headers: this.createHeaders(),
    });
  }

  getRoomAssociatedWithHotel(hotelId: string) {
    return this.http.get(`${this.ROOM_SERVICE_URL}/${hotelId}`, {
      headers: this.createHeaders(),
    });
  }

  makeBooking(payload: any) {
    return this.http.post(`${this.BOOKING_BASE_URL}`, payload, {
      headers: this.createHeaders(),
    });
  }

  makePayment(payload: any) {
    return this.http.post(`${this.PAYMENTS_SERVICE_URL}`, payload, {
      headers: this.createHeaders(),
    });
  }

  createHeaders() {
    const header = { Authorization: `Bearer ${this.authToken}` };
    console.log(header);

    return header;
  }
}

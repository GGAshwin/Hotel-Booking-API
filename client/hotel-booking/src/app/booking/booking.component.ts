import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../services/util.service';
import { Hotel } from '../home/home.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit {
  hotelId!: string;
  hotelObj!: Hotel;
  hotelRoomsData: any = [];

  bookingObj = {
    hotelId: this.hotelId,
    travelerId: localStorage.getItem('userId'),
    roomType: 'DELUXE',
    price: 1234,
    checkIn: '2024-12-01',
    checkOut: '2024-12-07',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    paymentMethod: 'CREDIT',
  };

  showBusy = true;
  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    console.log(this.route.params);

    this.route.params.subscribe((params) => {
      console.log(params);

      this.hotelId = params['hotelId'];
      console.log('Hotel ID:', this.hotelId); // Debugging or further use

      if (this.hotelId) {
        this.utilService.getHotelById(this.hotelId).subscribe((data: any) => {
          if (data) {
            this.showBusy = false;
            let hotelData = data as Hotel;
            console.log(hotelData);

            this.getRooms();
          }
        });
      }
    });
  }

  getRooms() {
    this.utilService
      .getRoomAssociatedWithHotel(this.hotelId)
      .subscribe((roomsData: any) => {
        console.log(roomsData);

        this.hotelRoomsData = roomsData[0].roomType;
        console.log(this.hotelRoomsData);
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
  fromDate: any;
  toDate: any;

  bookingObj = {};

  showBusy = true;
  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private router: Router
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

  makeBooking(roomType: string, roomPrice: number) {
    this.fromDate = new Date(this.fromDate);
    this.fromDate = this.fromDate.toISOString().split('T')[0];

    this.toDate = new Date(this.toDate);
    this.toDate = this.toDate.toISOString().split('T')[0];
    console.log(this.fromDate, this.toDate);

    this.bookingObj = {
      hotelId: this.hotelId,
      travelerId: localStorage.getItem('userId'),
      checkIn: this.fromDate,
      checkOut: this.toDate,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: 'CREDIT',
      roomType: roomType,
      price: roomPrice,
    };
    this.utilService.makeBooking(this.bookingObj).subscribe((res: any) => {
      console.log(res);
      if (res) {
        //do something
        this.router.navigate(['/payment/', res.id], {
          state: { data: { price: res.price } },
        });
      }
    });
  }
}

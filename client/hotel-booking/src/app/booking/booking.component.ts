import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit {
  hotelId!: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.route.params);

    this.route.params.subscribe((params) => {
      console.log(params);

      this.hotelId = params['hotelId'];
      console.log('Hotel ID:', this.hotelId); // Debugging or further use
    });
  }
}

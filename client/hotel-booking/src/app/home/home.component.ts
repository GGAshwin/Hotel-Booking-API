import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  hotelArray: Hotel[] = [];

  constructor(
    private readonly utilService: UtilService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.utilService.getHotels().subscribe((data: any) => {
      console.log(data);
      this.hotelArray = data;
    });
  }

  bookHotel(hotelId: string) {
    console.log(hotelId);

    this.router.navigate(['/booking/', hotelId]);
  }
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  managerId: string;
  rating: number;
  amenities: Amenities;
}

export interface Amenities {
  parking: boolean;
  wifi: boolean;
  roomService: boolean;
  spa: boolean;
  pool: boolean;
  [key: string]: boolean; // To accommodate additional amenities dynamically if needed
}

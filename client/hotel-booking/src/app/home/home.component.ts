import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private readonly utilService: UtilService) {}
  ngOnInit(): void {
    this.utilService.getHotels().subscribe((data) => {
      console.log(data);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  price = 0;
  paymentType = '';
  bookingId = '';
  constructor(
    private route: ActivatedRoute,
    private util: UtilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('id') || '';
    const stateData = history.state.data;
    if (stateData) {
      this.price = stateData.price;
    }
  }

  doPayment() {
    let payload = {
      user_id: localStorage.getItem('userId'),
      amount: this.price,
      payment_method: this.paymentType,
    };
    this.util.makePayment(payload).subscribe((res) => {});
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route
  { path: 'home', component: HomeComponent }, // Default route
  { path: 'login', component: LoginComponent }, // Navigate to About page
  { path: 'booking/:hotelId', component: BookingComponent }, // Navigate to Bookign page
  { path: 'payment/:bookingId', component: PaymentComponent }, // Navigate to Payment page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route
  { path: 'home', component: HomeComponent }, // Default route
  { path: 'login', component: LoginComponent }, // Navigate to About page
  { path: 'booking/:hotelId', component: BookingComponent }, // Navigate to Bookign page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

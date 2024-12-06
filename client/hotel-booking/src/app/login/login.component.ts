import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  registerPayload = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'TRAVELER',
  };
  loginPayload = {
    email: '',
    password: '',
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private readonly utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/home']);
    }
  }

  onRegister() {
    console.log(JSON.parse(JSON.stringify(this.registerPayload)));

    this.utilService.registerUser(this.registerPayload).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage =
          err.error.message || 'Registration failed. Please try again.';
        this.successMessage = null;
      },
    });
  }

  onLogin() {
    this.utilService.loginUser(this.loginPayload).subscribe({
      next: (response: any) => {
        this.successMessage = 'Login successful!';
        this.errorMessage = null;
        localStorage.setItem('authToken', response.token); // Store the token
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage =
          err.error.message || 'Login failed. Invalid credentials.';
        this.successMessage = null;
      },
    });
  }
}

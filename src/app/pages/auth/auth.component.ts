import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Amplify } from 'aws-amplify';
import { AuthFormField as AuthFormFields } from '@aws-amplify/ui-components';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { pipe, Observable, take, map } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnChanges {
public formFields = {
    signUp: {
      email: {
        order:1
      },
      username: {
        order: 2
      },
      password: {
        order: 3
      },
      confirm_password: {
        order: 4
      }
    },
    signIn: {
      username: {
        order:1
      },
      password: {
        order: 2
      }
    },
  };

  services = {
    async validateCustomSignUp(formData: Record<string, string>): Promise<Record<string, string> | void> {
      if (!formData['acknowledgement']) {
        return {
          acknowledgement: 'You must agree to the Terms & Conditions',
        };
      }
    },
  };
  constructor(private router: Router, public authenticator: AuthenticatorService) {
  }

  checkAuthStatus(): Promise<void> {
    if (this.authenticator.authStatus === 'authenticated') {
      Promise.resolve(this.router.navigate(['/home']));
    } return Promise.resolve();
  }
  ngOnInit(): void {
    this.checkAuthStatus();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authenticator']) {
      this.checkAuthStatus();
    }
  }
}


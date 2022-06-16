import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Amplify, Hub } from 'aws-amplify';
import { AuthFormField as AuthFormFields } from '@aws-amplify/ui-components';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { pipe, Observable, take, map } from 'rxjs';
import { tap, switchMap, filter, takeUntil } from 'rxjs/operators';

Hub.listen('auth', (data) => {
    switch (data.payload.event) {
        case 'signIn':
            console.log('user signed in');
            // do something
            break;
        case 'signUp':
            console.log('user signed up');
            break;
        case 'signOut':
            console.log('user signed out');
            break;
        case 'signIn_failure':
            console.log('user sign in failed');
            break;
        case 'configured':
            console.log('the Auth module is configured');
    }
});
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
    @Output() signOutEvent = new EventEmitter<void>();
    public formFields = {
        signUp: {
            email: {
                order: 1,
            },
            username: {
                order: 2,
            },
            password: {
                order: 3,
            },
            confirm_password: {
                order: 4,
            },
        },
        signIn: {
            username: {
                order: 1,
            },
            password: {
                order: 2,
            },
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
    constructor(private router: Router, public authenticator: AuthenticatorService) {}

    ngOnInit(): void {}
}

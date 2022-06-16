import { AfterViewInit, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, Hub } from 'aws-amplify';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

export interface User {
    username: string;
    email: string;
    verified: boolean;
    userPool: string;
}
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, AfterViewInit {
    @Output() authEvent = new EventEmitter<string>();
    // The '!' is a workaround for error '<object> has no initializer and is not definitely assigned in the constructor'
    currentUser!: User;

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

    ngOnInit(): void {
        Hub.listen('auth', (data) => {
            switch (data.payload.event) {
                case 'signIn':
                    console.info(`User ${this.currentUser.username} signed in at ${window.location.href}`);
                    break;
                case 'signUp':
                    console.info(`User ${this.currentUser.username} signed up`);
                    break;
                case 'signOut':
                    console.info(`User ${this.currentUser.username} signed out`);
                    break;
                case 'signIn_failure':
                    console.error('Sign in failure. Error: ' + data.payload.message);
                    break;
                case 'configured':
                    console.log('Congrats! Auth module is configured');
            }
        });
    }

    // Used once the page is fully loaded, great for data retrieval and initialization
    ngAfterViewInit(): void {
        Auth.currentAuthenticatedUser({
            bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        })
            .then((user) => {
                this.currentUser = {
                    username: user.username,
                    email: user.attributes.email,
                    verified: user.attributes.email_verified,
                    userPool: user.pool.userPoolId,
                };
            })
            .catch((err) => console.log(err));
    }

    // Unused for now as Auth is the parent-most component of the app, saving for a future use case
    userDetails(value: string) {
        this.authEvent.emit(value);
    }
}

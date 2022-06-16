import { Component, Input, OnInit } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
export interface Section {
    name: string;
    icon: string;
    link: string;
    fn?: () => void;
}
@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
    apps: Section[] = [
        { name: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
        { name: 'Menu', icon: 'menu', link: '/menu' },
        { name: 'Sign Out', icon: 'person', link: '', fn: () => this.authenticator.signOut() },
    ];
    constructor(private authenticator: AuthenticatorService) {}

    ngOnInit(): void {}
}

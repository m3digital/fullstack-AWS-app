import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { APIService, Restaurant } from '../../API.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
    displayedColumns: string[] = ['name', 'email', 'description', 'city'];
    errorMatcher = new MyErrorStateMatcher();
    myFormControl: FormControl;
    title = 'angular-portfolio';
    public createForm: FormGroup;
    public dataSource = new MatTableDataSource<Restaurant>([]);
    private subscription: Subscription | null = null;
    @ViewChild(MatPaginator) private paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private api: APIService, private fb: FormBuilder) {
        this.createForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            description: ['', Validators.required],
            city: ['', Validators.required],
        });
        this.myFormControl = this.createForm.get('name') as FormControl;
    }

    async ngOnInit() {
        /* fetch restaurants when app loads */
        this.api.ListRestaurants().then((event) => {
            this.dataSource.data = event.items as Restaurant[];
        });

        this.subscription = <Subscription>this.api.OnCreateRestaurantListener.subscribe((event: any) => {
            const newData = event.value.data.onCreateRestaurant;
            this.dataSource.data = [newData, ...this.dataSource.data];
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = null;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public onCreate(restaurant: Restaurant) {
        this.api
            .CreateRestaurant(restaurant)
            .then((event) => {
                console.log('item created via GraphQL!');
            })
            .catch((e) => {
                console.log('error creating restaurant...', e);
            });
    }
}

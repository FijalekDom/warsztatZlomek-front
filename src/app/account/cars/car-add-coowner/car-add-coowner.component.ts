import {Component, Input, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoownerModel} from '../../../app.component';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'app-car-add-coowner',
  templateUrl: './car-add-coowner.component.html',
  styleUrls: ['./car-add-coowner.component.css']
})
export class CarAddCoownerComponent implements OnInit {
    @Input()
    id: number;
    addForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.addForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f() { return this.addForm.controls; }

    addCoowner() {
        this.submitted = true;

        if (this.addForm.invalid) {
            return;
        }

        const coowner: CoownerModel = {
            carId: this.id,
            coownerUsername: this.f.email.value,
            accessToken: JSON.parse(localStorage.getItem('currentUser'))
        };

        this.loading = true;

        console.log(coowner);

        this.authService.addCoowner(coowner)
            .pipe(first())
            .subscribe(
                user => {
                    this.loading = false;
                    window.location.reload();
                },
                error => {
                    console.log(error);
                    this.loading = false;
                }
            );
    }
}

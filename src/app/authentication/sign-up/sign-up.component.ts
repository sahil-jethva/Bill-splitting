import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [RouterLink, NgClass, FormsModule, ReactiveFormsModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {

    // isToggled
    isToggled = false;
    isPasswordVisible: boolean = false;
    isConfirmPasswordVisible: boolean = false;
    formData: FormGroup

    constructor(public themeService: CustomizerSettingsService, private httpClient: HttpClient,private fb:FormBuilder) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.formData = this.fb.group({
            Name: [''],
            Email: [''],
            Password: ['', [Validators.required, Validators.minLength(8)]],
            ConfirmPassword:['',[Validators.required, Validators.minLength(8)]]
        })
    }
    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
    toggleConfirmPasswordVisibility(): void {
        this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
    onSubmit() {
        const url = 'http://localhost:3000/register'
        const requestbody = {
            name: this.formData.get('Name')?.getRawValue(),
            email: this.formData.get('Email')?.getRawValue(),
            password: this.formData.get('Password')?.getRawValue(),
        }
        this.httpClient.post(url, requestbody).subscribe((res) => {
            this.toggleClass2()
            this.formData.reset()
            // this.router.navigate(['/authentication'])
        })
    }
    classApplied2 = false;
    toggleClass2() {
        this.classApplied2 = !this.classApplied2;
    }
}

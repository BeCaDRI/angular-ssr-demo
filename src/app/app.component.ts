import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Component,  Inject, OnInit, Optional, PLATFORM_ID} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {TranslateService} from "./services/translate.service";
import {DataService} from "./services/data.service";
import {isPlatformBrowser} from "@angular/common";
import {QUERYPARAMS} from "../tokens";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

  formData: { email: string, name: string }   = { name: '', email: ''};
  buttonText: string = 'Submit';
  emailLabel: string = 'Email';
  nameLabel: string = 'Name';
  successMessage: string = '';
  helloVar: string = 'Hello';

  constructor(@Inject(PLATFORM_ID) private platformId: object,
              @Optional() @Inject(QUERYPARAMS) public queryParams: { email: string, name: string, lang: string },
              private http: HttpClient, private translationService: TranslateService){
    console.log(JSON.stringify(queryParams));
    this.helloVar = this.translationService.translate('test::hello', this.queryParams?.lang);
    this.buttonText = this.translationService.translate('test::submit', this.queryParams?.lang);
    this.emailLabel = this.translationService.translate('test::email', this.queryParams?.lang);
    this.nameLabel = this.translationService.translate('test::name', this.queryParams?.lang);
    this.formData = {
      name: this.queryParams?.name || '',
      email: this.queryParams?.email || ''
    };
  }


  onSubmit() {
    this.http.get(`api/form-submit/?name=${this.formData.name}&email=${this.formData.email}`, )
      .subscribe(response => {
        this.successMessage =JSON.stringify(response);
      });
  }

}

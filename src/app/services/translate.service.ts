import { Injectable } from '@angular/core';
import {Translations, TranslationsDe} from "../translations";

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() { }

  translate(key: string, lang: string = 'de'): string {
    if (lang === 'en') {
      return Translations[key];
    }
    return TranslationsDe[key];
  }
}

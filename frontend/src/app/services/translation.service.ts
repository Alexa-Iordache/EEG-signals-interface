import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const LANG_KEY = 'app_lang'; // Key for storing language in local storage

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang: string = 'en'; // Default language
  private translations: any = {}; // Object to hold translations
  private translations$ = new BehaviorSubject<any>({}); // BehaviorSubject for translations

  constructor(private http: HttpClient) {
    const storedLang = localStorage.getItem(LANG_KEY);
    this.currentLang = storedLang || 'en'; // Initialize with stored language or default to English
    this.loadTranslations(this.currentLang);
  }

  loadTranslations(lang: string) {
    this.http.get(`assets/i18n/${lang}.json`).subscribe(translations => {
      this.translations = translations;
      this.translations$.next(this.translations);
      this.currentLang = lang;
      localStorage.setItem(LANG_KEY, lang); // Store selected language in local storage
    });
  }

  switchLang(lang: string) {
    this.loadTranslations(lang);
  }

  getTranslations() {
    return this.translations$.asObservable();
  }

  getCurrentLang() {
    return this.currentLang;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RandomWordService {
  private apiUrl = 'https://random-word-form.herokuapp.com/random/noun';

  constructor(private http: HttpClient) {}

  // Method to fetch a random word from the API
  getRandomWord(): Observable<string> {
    return this.http.get<string>(this.apiUrl);
  }
}

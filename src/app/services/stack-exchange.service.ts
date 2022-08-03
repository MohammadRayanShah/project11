import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StackExchangeService {
  private url = 'https://api.stackexchange.com/2.3/';
  constructor(public httpClient: HttpClient) { }

  getAllQuestions(params: HttpParams): Observable<any> {
    return this.httpClient.get(this.url + 'search' + `?${params}`);
  }

  getQuestion(questionId: number, params: HttpParams): Observable<any> {
    return this.httpClient.get(this.url + 'questions/' + questionId + `?${params}`)
  }

  getAnswers(questionId: number, params: HttpParams): Observable<any> {
    return this.httpClient.get(this.url + 'questions/' + `${questionId}` + '/answers' + `?${params}`);
  }
}

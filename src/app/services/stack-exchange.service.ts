import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StackExchangeService {

  private searchUrl = 'https://api.stackexchange.com/2.3/search'
  constructor(
    public httpClient: HttpClient
  ) { }

  getAll(data: any, unixTimestampFrom: any, unixTimestampTo: any): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        page: data.page || '',
        pagesize: data.pagesize || '',
        fromdate: unixTimestampFrom || '',
        todate: unixTimestampTo || '',
        order: data.order || '',
        sort: data.sort || '',
        tagged: data.tagged || '',
        nottagged: data.nottagged || '',
        intitle: data.intitle || '',
        site: data.site,
      }
    });
    return this.httpClient.get(this.searchUrl + `?${params}`)
  }

}

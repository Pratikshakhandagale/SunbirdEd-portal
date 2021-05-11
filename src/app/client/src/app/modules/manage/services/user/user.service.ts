import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService, RequestParam, ServerResponse, HttpOptions } from '@sunbird/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserManageService {

  constructor(public httpClient: HttpClient) { }


  public getUserList(): Observable<any> {
    let url = "https://demo.appcarvers.com/junite/index.php?option=com_api&app=users&resource=users&format=raw&key=e879428b898e931e00dcdcc3f150e7689337a61c&search=a"
    let headers: HttpHeaders = new HttpHeaders();

    return this.httpClient.get(url, {
      headers: headers
    })
      .pipe(
        map(res => {
          console.log({ res });

          return res;
        })
      );
  }

  public save(RequestParam): Observable<any> {
  
    return this.httpClient.post(RequestParam.url, RequestParam.data).pipe(
      map((apiResponse: ServerResponse) => {
        return apiResponse;
      }),
      catchError((err) => {
        return of(err);
      }));

  }

}


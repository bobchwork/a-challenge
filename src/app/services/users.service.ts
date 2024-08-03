import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiResult } from '../models/api-result.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  /**
   * Fetches 5000 mock users from the api
   * @param {number} page
   * @returns {Observable<User[]>}
   */
  public getUsers(page = 1, usersPerPage = 5000): Observable<User[]> {
    // seed=awork. Seeds allow you to always generate the same set of users
    return this.httpClient
      .get<ApiResult>(
        `${this.apiUrl}?results=${usersPerPage}&seed=awork&page=${page}`,
      )
      .pipe(map((apiResult) => User.mapFromUserResult(apiResult.results)));
  }
}

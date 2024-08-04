import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { catchError, combineLatest, finalize, forkJoin, of } from 'rxjs';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersGroups } from './models/user.model';
import { UsersService } from './services/users.service';
import { UserListControlsComponent } from './components/user-list-controls/user-list-controls.component';
import { environment } from '../environments/environment';
import { UsersStore } from './stores/users.store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserListComponent, UserListControlsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [UsersStore],
})
export class AppComponent implements OnInit {
  public usersService = inject(UsersService);
  public usersStore = inject(UsersStore);
  public isLoading = false;

  private usersListWorker!: Worker;

  private pageSize = 5000;
  private currentPage = 1;

  public ngOnInit(): void {
    this.usersListWorker = new Worker(
      new URL('./workers/users-list.worker', import.meta.url),
    );
    this.fetchUsers(this.currentPage, this.pageSize);
  }

  private handleUsersListWorker(): void {
    this.isLoading = true;
    this.usersListWorker.postMessage(this.usersStore.allFilteredUsers());
    this.usersListWorker.onmessage = (event: MessageEvent<UsersGroups>) => {
      this.usersStore.groups.set(event.data);
      this.isLoading = false;
    };
  }

  private fetchUsers(page: number, pageSize: number): void {
    this.isLoading = true;

    // ONLY FOR DEVELOP. Not ideal, The service worker would be more efficient than this. localstorage has limitations.

    if (
      !environment.production &&
      environment.enableCache &&
      localStorage.getItem('users')
    ) {
      console.log(
        'This is a mock request. In a real-world application, the data would be fetched or returned by the service worker.',
        environment,
      );
      this.usersStore.users.set(JSON.parse(localStorage.getItem('users')!));
      this.isLoading = false;
      this.handleUsersListWorker();
      return;
    }

    // HTTP requests are handled and completed by Angular's HttpClient
    this.usersService
      .getUsers(page, pageSize)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((error: any) => {
          // We can handle errors here. At the moment we just log the error
          console.log('Failed to fetch users', error);
          return of();
        }),
      )
      .subscribe((users) => {
        this.usersStore.users.set(users);
        localStorage.setItem('users', JSON.stringify(users));
        // Worker initialization
        this.handleUsersListWorker();
      });
  }
}

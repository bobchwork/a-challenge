import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersGroups } from './models/user.model';
import { UsersService } from './services/users.service';
import { UserListControlsComponent } from './components/user-list-controls/user-list-controls.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserListComponent, UserListControlsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public usersService = inject(UsersService);

  public users: any[] = [];
  public isLoading = false;
  public groupsSignal: WritableSignal<UsersGroups | null> = signal(null);

  private usersListWorker!: Worker;

  private pageSize = 5000;
  private currentPage = 1;

  public ngOnInit(): void {
    this.usersListWorker = new Worker(
      new URL('./workers/users-list.worker', import.meta.url)
    );
    this.fetchUsers(this.currentPage, this.pageSize);
  }

  private handleUsersListWorker(): void {
    this.usersListWorker.postMessage(this.users);
    this.usersListWorker.onmessage = (event: MessageEvent<UsersGroups>) => {
      this.groupsSignal.set(event.data);
    };
  }

  private fetchUsers(page: number, pageSize: number): void {
    this.isLoading = true;

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
        })
      )
      .subscribe((users) => {
        this.users = users;
        // Worker initialization
        this.handleUsersListWorker();
      });
  }
}

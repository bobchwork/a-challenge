import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserListControlsComponent } from '../../components/user-list-controls/user-list-controls.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UsersGroups } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../stores/users.store';
import { PaginatorComponent } from '../../components/shared/paginator/paginator.component';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [UserListComponent, UserListControlsComponent, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [UsersStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  @Input() page?: string;
  public usersService = inject(UsersService);
  public cacheService = inject(CacheService);
  public usersStore = inject(UsersStore);
  public router = inject(Router);
  public isLoading = signal(false);

  private toastr = inject(ToastrService);

  private usersListWorker!: Worker;

  private pageSize = this.usersStore.pageSize();

  public ngOnInit(): void {
    this.usersListWorker = new Worker(
      new URL('../../workers/users-list.worker', import.meta.url),
    );

    this.setNewCurrentPage();
    this.fetchUsers(this.usersStore.currentPage(), this.pageSize);
  }

  private setNewCurrentPage(): void {
    const page = this.page ? parseInt(this.page) : 1;
    const currentPage = this.page !== '' && !isNaN(page) ? page : 1;
    this.usersStore.currentPage.set(currentPage);
  }

  private handleUsersListWorker(): void {
    this.isLoading.set(true);
    this.usersListWorker.postMessage(this.usersStore.allFilteredUsers());
    this.usersListWorker.onmessage = (event: MessageEvent<UsersGroups>) => {
      this.usersStore.groups.set(event.data);
      this.isLoading.set(false);
    };
  }

  private fetchUsers(page: number, pageSize: number): void {
    this.isLoading.set(true);

    const parsedItems = this.cacheService.getCacheData();
    const pageNumber = page || 1;
    // ONLY FOR DEVELOP. Not ideal, The service worker would be more efficient than this. localstorage has limitations.
    if (
      !environment.production &&
      environment.enableCache &&
      parsedItems &&
      parsedItems[pageNumber]
    ) {
      console.log(
        'This is a mock request. In a real-world application, the data would be fetched or returned by the service worker.',
        environment,
      );
      this.usersStore.users.set(parsedItems[page]);
      this.isLoading.set(false);
      this.handleUsersListWorker();
      return;
    }

    // HTTP requests are handled and completed by Angular's HttpClient
    this.usersService
      .getUsers(page, pageSize)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        catchError((error: any) => {
          // We can handle errors here. At the moment we just log the error
          console.log('Failed to fetch users', error);
          this.toastr.error('Failed to fetch users');
          throw error;
        }),
      )
      .subscribe((users) => {
        this.usersStore.users.set(users);

        this.cacheService.setCacheData(users, page);
        // Worker initialization
        this.handleUsersListWorker();
      });
  }

  public nextClicked(): void {
    this.usersStore.currentPage.set(this.usersStore.currentPage() + 1);
    this.router.navigate([`/${this.usersStore.currentPage()}`]);
    this.fetchUsers(this.usersStore.currentPage(), this.pageSize);
  }
  public prevClicked(): void {
    const currentPage = this.usersStore.currentPage();
    if (currentPage > 1) {
      this.usersStore.currentPage.set(currentPage - 1);
      this.router.navigate([`/${currentPage - 1}`]);
      this.fetchUsers(this.usersStore.currentPage(), this.pageSize);
    }
  }
}

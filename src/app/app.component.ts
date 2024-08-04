import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserListControlsComponent } from './components/user-list-controls/user-list-controls.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersStore } from './stores/users.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserListComponent, UserListControlsComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [UsersStore],
})
export class AppComponent {}

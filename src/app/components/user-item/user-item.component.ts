import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-item',
  standalone: true,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemComponent {
  public user = input.required<User>();
  public allUsers = input.required<User[]>();

  /**
   * Get the count of users with same nationality
   */
  get nationalitiesCount(): number {
    if (!this.allUsers().length) {
      return 0;
    }

    return this.allUsers().reduce((acc, user) => {
      return user.nat === this.user().nat ? acc + 1 : acc;
    }, 0);
  }
}

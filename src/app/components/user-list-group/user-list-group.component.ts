import { Component, computed, input } from '@angular/core';
import { User, UsersGroups } from '../../models/user.model';
import { GROUP_BY } from '../../consts';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserItemComponent } from '../user-item/user-item.component';
import { FormatStringPipe } from '../../pipes/format-string.pipe';
import { CustomPipesModule } from '../../pipes/custom-pipes/custom-pipes.module';

@Component({
  selector: 'app-user-list-group',
  standalone: true,
  imports: [ScrollingModule, UserItemComponent, CustomPipesModule],
  templateUrl: './user-list-group.component.html',
  styleUrl: './user-list-group.component.scss',
})
export class UserListGroupComponent {
  public users = input.required<User[]>();
  public usersGroups = input<UsersGroups | null>();
  public selectedGroupOption = input<GROUP_BY | null>();

  public GROUP_BY = GROUP_BY;
  public readonly isAllUsersSelected = computed(
    () =>
      this.selectedGroupOption() !== GROUP_BY.ALPHABET &&
      this.selectedGroupOption() !== GROUP_BY.NATIONALITY &&
      this.selectedGroupOption() !== GROUP_BY.AGE_RANGE,
  );

  public usersFromCurrentGroup = computed(() => {
    if (this.selectedGroupOption() === GROUP_BY.ALPHABET) {
      return this.usersGroups()?.alphabetically;
    } else if (this.selectedGroupOption() === GROUP_BY.NATIONALITY) {
      return this.usersGroups()?.nationality;
    } else if (this.selectedGroupOption() === GROUP_BY.AGE_RANGE) {
      return this.usersGroups()?.age;
    }
    return {};
  });

  public readonly headers = computed(() => {
    let headers: string[] = [];
    const currentGroup = this.usersFromCurrentGroup();

    headers = currentGroup ? Object.keys(currentGroup) : [];
    if (headers.length === 0) {
      return headers;
    }

    return this.selectedGroupOption() === GROUP_BY.AGE_RANGE
      ? headers
      : headers.sort();
  });
}

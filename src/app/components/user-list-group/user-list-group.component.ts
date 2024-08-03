import { Component, computed, input, signal } from '@angular/core';
import { User, UsersGroups } from '../../models/user.model';
import { GROUP_BY } from '../../consts';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserItemComponent } from '../user-item/user-item.component';
import { FormatStringPipe } from '../../pipes/format-string.pipe';
import { CustomPipesModule } from '../../pipes/custom-pipes/custom-pipes.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list-group',
  standalone: true,
  imports: [
    ScrollingModule,
    UserItemComponent,
    CustomPipesModule,
    CommonModule,
  ],
  templateUrl: './user-list-group.component.html',
  styleUrl: './user-list-group.component.scss',
})
export class UserListGroupComponent {
  public users = input.required<User[]>();
  public usersGroups = input<UsersGroups | null>();
  public selectedGroupOption = input<GROUP_BY | null>();

  public isExpanded = signal(false);
  public expandedIndex = signal<number | null>(null);
  public selectedHeader = signal<string | null>(null);

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

  private openItem(index: number): void {
    this.expandedIndex.set(index);
    this.isExpanded.set(true);
  }
  private closeItem(): void {
    this.expandedIndex.set(null);
    this.isExpanded.set(false);
  }

  public itemClick(index: number): void {
    if (this.isExpanded() && index !== this.expandedIndex()) {
      this.closeItem();
      this.openItem(index);
    } else if (this.isExpanded() && index === this.expandedIndex()) {
      this.closeItem();
    } else if (!this.isExpanded()) {
      this.openItem(index);
    }
  }

  public articleClick(header: string): void {
    this.selectedHeader.set(header);
  }

  public comparedUserId(comparedUserId: string, index: number): boolean {
    const key = this.selectedHeader();
    const currentGroup = this.usersFromCurrentGroup();
    if (!key || !currentGroup || !currentGroup[key]) {
      return false;
    }
    return comparedUserId === currentGroup[key][index]?.login?.uuid;
  }
}

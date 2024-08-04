import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { GROUP_BY } from '../../consts';
import { CustomPipesModule } from '../../pipes/custom-pipes/custom-pipes.module';
import { UsersStore } from '../../stores/users.store';
import { UserItemComponent } from '../user-item/user-item.component';

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
  public usersStore = inject(UsersStore);

  public isExpanded = signal(false);
  public expandedIndex = signal<number | null>(null);
  public selectedHeader = signal<string | null>(null);

  public GROUP_BY = GROUP_BY;

  public readonly selectedItemUIID = computed((): string => {
    const key = this.selectedHeader();
    const currentGroup = this.usersFromCurrentGroup();
    const index = this.expandedIndex();
    if (
      !key ||
      !currentGroup ||
      !currentGroup[key] ||
      index === null ||
      currentGroup[key][index] === undefined
    ) {
      return '';
    }
    return currentGroup[key][index]?.login?.uuid || '';
  });
  public usersFromCurrentGroup = computed(() => {
    if (this.usersStore.groupBy() === GROUP_BY.ALPHABET) {
      return this.usersStore.groupedAlphabetically();
    } else if (this.usersStore.groupBy() === GROUP_BY.NATIONALITY) {
      return this.usersStore.groupedByNationality();
    } else if (this.usersStore.groupBy() === GROUP_BY.AGE_RANGE) {
      return this.usersStore.groupedByAge();
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

    return this.usersStore.groupBy() === GROUP_BY.AGE_RANGE
      ? headers
      : headers.sort();
  });

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

  private openItem(index: number): void {
    this.expandedIndex.set(index);
    this.isExpanded.set(true);
  }
  private closeItem(): void {
    this.expandedIndex.set(null);
    this.isExpanded.set(false);
  }
}

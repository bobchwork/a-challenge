import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { GROUP_BY } from '../consts';
import { User, UsersGroups } from '../models/user.model';

interface UserState {
  users: User[];
  groups?: UsersGroups;
  groupBy?: GROUP_BY;
  searchTerm?: string;
  currentPage: number;
  pageSize: number;
}
const initialUserState: UserState = {
  users: [],
  groups: undefined,
  groupBy: undefined,
  searchTerm: '',
  currentPage: 1,
  pageSize: 5000,
};

// Small custom store implementation  for  keeping and sharing the state through the components
@Injectable()
export class UsersStore {
  public users: WritableSignal<User[]> = signal(initialUserState.users);
  public pageSize: WritableSignal<number> = signal(initialUserState.pageSize);
  public currentPage: WritableSignal<number> = signal(
    initialUserState.currentPage,
  );
  public groups: WritableSignal<UsersGroups | undefined> = signal(
    initialUserState.groups,
  );
  public groupBy: WritableSignal<GROUP_BY | undefined> = signal(
    initialUserState.groupBy,
  );
  public searchTerm: WritableSignal<string | undefined> = signal(
    initialUserState.searchTerm,
  );

  public readonly allFilteredUsers = computed(() =>
    this.fitlerUsersBySearchTerm(this.users()),
  );

  public readonly groupedAlphabetically = computed(() => {
    const firstChar = this.searchTerm()?.trim()?.charAt(0).toUpperCase();
    if (firstChar) {
      const users =
        this.groups()?.alphabetically &&
        this.groups()?.alphabetically![firstChar];
      return { [firstChar]: this.fitlerUsersBySearchTerm(users ?? []) };
    }
    return this.groups()?.alphabetically;
  });

  public readonly groupedByAge = computed(() => {
    const searchTerm = this.searchTerm();
    if (searchTerm && searchTerm.trim().length > 0 && this.groups()?.age) {
      const ageGroups = this.groups()?.age ?? {};
      const filteredGroup = this.filterGroupBySearchTerm(ageGroups);
      return filteredGroup;
    }

    return this.groups()?.age;
  });

  public readonly groupedByNationality = computed(() => {
    const searchTerm = this.searchTerm();
    if (
      searchTerm &&
      searchTerm.trim().length > 0 &&
      this.groups()?.nationality
    ) {
      const nationalityGroups = this.groups()?.nationality ?? {};
      const filteredGroup = this.filterGroupBySearchTerm(nationalityGroups);
      return filteredGroup;
    }
    return this.groups()?.nationality;
  });

  public readonly isAllUsersSelected = computed(
    () =>
      this.groupBy() !== GROUP_BY.ALPHABET &&
      this.groupBy() !== GROUP_BY.NATIONALITY &&
      this.groupBy() !== GROUP_BY.AGE_RANGE,
  );

  /**
   * Filters the given array of users based on the current search term.
   *
   * @param users - An array of User objects to be filtered.
   * @returns A new array of User objects whose first names start with the current search term.
   */
  private fitlerUsersBySearchTerm(users: User[]): User[] {
    return users.filter((user: User) =>
      user.firstname?.toLowerCase().startsWith(this.searchTerm()?.trim() || ''),
    );
  }

  /**
   * Filters the users within each group based on the current search term.
   *
   * @param group - An object where the keys are group identifiers and the values are arrays of users belonging to those groups.
   * @returns A new object with the same keys as the input group, but with the user arrays filtered according to the search term.
   */
  private filterGroupBySearchTerm(group: { [key: string]: User[] }): {
    [key: string]: User[];
  } {
    return Object.keys(group).reduce(
      (acc: { [key: string]: User[] }, key: string) => {
        acc[key] = this.fitlerUsersBySearchTerm(group[key]);
        return acc;
      },
      {} as { [key: string]: User[] },
    );
  }
}

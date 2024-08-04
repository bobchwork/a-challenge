import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GROUP_BY } from '../../consts';
import { UsersGroups } from '../../models/user.model';
import { UsersStore } from '../../stores/users.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list-controls',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-list-controls.component.html',
  styleUrl: './user-list-controls.component.scss',
})
export class UserListControlsComponent implements OnInit {
  public formBuilder = inject(FormBuilder);
  public usersStore = inject(UsersStore);
  public selectedGroup = input();
  public destroyRef = inject(DestroyRef);
  public userGroups = input<UsersGroups | null>();
  public valuesChanged = output<{ search: string; groupBy: GROUP_BY }>();
  public searchForm: FormGroup = this.formBuilder.group({
    search: [''],
    groupBy: [''],
  });

  public readonly groupByOptions = computed(() => {
    return [
      { value: GROUP_BY.ALPHABET, label: 'Alphabet' },
      { value: GROUP_BY.NATIONALITY, label: 'Nationality' },
      { value: GROUP_BY.AGE_RANGE, label: 'Age Range' },
    ];
  });

  public readonly isUserGroupsLoading = computed(() => !this.userGroups());
  constructor() {
    effect(() => {
      if (this.isUserGroupsLoading()) {
        this.searchForm.get('search')?.disable();
        this.searchForm.get('groupBy')?.disable();
      } else {
        this.searchForm.get('search')?.enable();
        this.searchForm.get('groupBy')?.enable();
      }
    });
  }

  public ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes: { search: string; groupBy: GROUP_BY }) => {
        this.valuesChanged.emit({
          search: changes.search,
          groupBy: changes.groupBy,
        });
      });
  }

  public clearForm(): void {
    this.searchForm.patchValue({ search: '', groupBy: '' });
  }
}

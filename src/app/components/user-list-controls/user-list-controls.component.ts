import {
  Component,
  OnInit,
  computed,
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

@Component({
  selector: 'app-user-list-controls',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-list-controls.component.html',
  styleUrl: './user-list-controls.component.scss',
})
export class UserListControlsComponent implements OnInit {
  public formBuilder = inject(FormBuilder);
  public selectedGroup = input();
  public userGroups = input<UsersGroups | null>();
  public valuesChanged = output<{ search: string; groupBy: GROUP_BY }>();
  public selectedValue = null;
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

  public readonly isUserGroupsLoading = computed(() => !!this.userGroups);

  public ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(
      (changes: { search: string; groupBy: GROUP_BY }) => {
        this.valuesChanged.emit({
          search: changes.search,
          groupBy: changes.groupBy,
        });
      },
    );
  }

  public clearForm(): void {
    this.searchForm.patchValue({ search: '', groupBy: '' });
  }
}

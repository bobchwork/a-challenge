import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatString',
})
export class FormatStringPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    const formattedValue = value.replace(/_/g, ' ').toLowerCase();
    return formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
  }
}

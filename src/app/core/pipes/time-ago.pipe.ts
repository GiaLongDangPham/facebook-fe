import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false // Làm cho pipe impure để tự động cập nhật
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | string | undefined): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;

    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  }

}

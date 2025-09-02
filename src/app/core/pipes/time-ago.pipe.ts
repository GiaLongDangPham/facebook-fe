import { Pipe, PipeTransform } from '@angular/core';
import { format, formatDistanceToNow } from 'date-fns';
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
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Nếu quá 30 ngày thì hiển thị ngày cụ thể
    if (diffInDays > 30) {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    }

    // Nếu còn trong 30 ngày thì format time ago
    let result = formatDistanceToNow(date, { addSuffix: true, locale: vi });

    // Loại bỏ chữ "trước" và "khoảng", "dưới"
    result = result.replace('trước', '').trim();
    result = result.replace('khoảng', '').trim();
    result = result.replace('dưới', '').trim();

    return result;
  }

}

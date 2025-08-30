import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mentionHighlight',
  standalone: true
})
export class MentionHighlightPipe implements PipeTransform {

  transform(text: string): string {
    if (!text) return '';
    // Regex tìm @username
    return text.replace(
      /@(\w+)/g,
      `<a href="/user/profile/$1" class="text-blue-500 font-semibold hover:underline">@$1</a>`
    );
  }

}

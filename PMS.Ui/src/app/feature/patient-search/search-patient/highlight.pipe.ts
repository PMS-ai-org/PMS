import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined, term: string | null | undefined): SafeHtml {
    if (!value) return '';
    if (!term) return value;
    const cleaned = term.trim();
    if (!cleaned) return value;
    try {
      const escaped = cleaned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'ig');
      const highlighted = value.replace(regex, '<strong class="hl">$1</strong>');
      return this.sanitizer.bypassSecurityTrustHtml(highlighted);
    } catch {
      return value; // Fallback if regex fails
    }
  }
}

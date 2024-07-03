import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideClipboard } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';
import 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import { from, map, of, switchMap } from 'rxjs';

declare const Prism: typeof import('prismjs');

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({ lucideClipboard, lucideCheck })],
  host: {
    class:
      'relative block rounded-md bg-zinc-950 font-mono text-sm text-white dark:bg-zinc-900',
  },
  template: `
    @if (!disableCopy()) {
      <button
        data-testingId="copy"
        (click)="copyToClipBoard()"
        hlmBtn
        variant="ghost"
        aria-label="Copy to clipboard"
        class="absolute right-2 top-2 h-6 w-6 p-1"
      >
        <hlm-icon
          data-testingId="icon"
          size="xs"
          [name]="copied() ? 'lucideCheck' : 'lucideClipboard'"
        />
      </button>
    }
    <div class="max-h-[650px] w-full overflow-auto whitespace-nowrap p-4">
      <div
        data-testingId="code"
        class="max-w-screen max-w-full"
        [innerHTML]="content()"
      ></div>
    </div>
  `,
  styles: [
    `
      .token.class-name {
        opacity: 1;
      }

      .token.property,
      .token.tag,
      .token.boolean,
      .token.number,
      .token.constant,
      .token.symbol,
      .token.deleted,
      .token.selector,
      .token.attr-name,
      .token.string,
      .token.char,
      .token.builtin,
      .token.inserted,
      .token.atrule,
      .token.attr-value,
      .token.function,
      .token.regex,
      .token.important,
      .token.variable {
        opacity: 0.533;
      }

      .token.operator,
      .token.entity,
      .token.url,
      .token.keyword,
      .language-css .token.string,
      .style .token.string {
        opacity: 0.733;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CodeComponent {
  private readonly _clipboard = inject(Clipboard);
  private readonly marked: typeof marked;
  protected copied = signal(false);

  disableCopy = input(false, {
    transform: booleanAttribute,
  });

  language = input<'ts' | 'sh' | 'js'>('ts');

  code = input.required<string>();

  protected content = toSignal(
    toObservable(this.code).pipe(
      map((value) =>
        this.language() === 'sh'
          ? this.marked.parse(value?.trim() ?? '')
          : this.marked.parse(
              `\`\`\`typescript\n${value?.trim() ?? ''}\n\`\`\``,
            ),
      ),
      switchMap((data) => (typeof data === 'string' ? of(data) : from(data))),
    ),
  );

  constructor() {
    const renderer = new marked.Renderer();
    renderer.code = (code, lang) => {
      if (!lang) {
        return '<pre><code>' + code + '</code></pre>';
      }
      const langClass = 'language-' + lang;
      return (
        '<pre class="' +
        langClass +
        '"><code class="' +
        langClass +
        '">' +
        code +
        '</code></pre>'
      );
    };

    marked.use(
      gfmHeadingId(),
      markedHighlight({
        async: true,
        highlight: (code, lang) => {
          lang = lang || 'typescript';
          if (!Prism.languages[lang]) {
            console.warn(`Notice:
    ---------------------------------------------------------------------------------------
    The requested language '${lang}' is not available with the provided setup.
    To enable, import your main.ts as:
      import  'prismjs/components/prism-${lang}';
    ---------------------------------------------------------------------------------------
        `);
            return code;
          }
          return Prism.highlight(code, Prism.languages[lang], lang);
        },
      }),
      {
        renderer,
        pedantic: false,
        gfm: true,
        breaks: false,
      },
    );

    this.marked = marked;
  }

  protected copyToClipBoard() {
    if (!this.code()) return;
    this._clipboard.copy(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 3000);
  }
}

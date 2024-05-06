import { NgClass, isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  TemplateRef,
  computed,
  inject,
  isDevMode,
  signal,
  viewChild,
} from '@angular/core';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import { PageNavLinkComponent } from '../page-nav-link/page-nav-link.component';
import { pageNavTemplate } from '../page-nav-outlet/page-nav-outlet.component';

type SamePageAnchorLink = {
  id: string;
  label: string;
  isNested: boolean;
  isActive: boolean;
};

@Component({
  selector: 'app-page-nav',
  standalone: true,
  imports: [HlmScrollAreaComponent, NgClass, PageNavLinkComponent],
  host: {
    class: 'hidden xl:block text-sm',
  },
  template: `
    <ng-template #pageNav>
      <hlm-scroll-area data-testingId="page-nav" class="h-[calc(100vh-3.5rem)]">
        <div class="space-y-2 px-1">
          <h3 class="font-medium">On this page</h3>
          <ul data-testingId="links" class="m-0 flex list-none flex-col">
            @for (link of links(); track link.id) {
              <app-page-nav-link
                [ngClass]="{ 'pl-4': link.isNested }"
                [fragment]="link.id"
                [label]="link.label"
                [active]="link.isActive"
              />
            } @empty {
              @if (isDevMode()) {
                [DEV] Nothing to see here!
              }
            }
          </ul>
        </div>
      </hlm-scroll-area>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNavComponent implements AfterViewInit, OnDestroy {
  private pageNavTpl = viewChild.required<TemplateRef<unknown>>('pageNav');

  protected readonly isDevMode = signal(isDevMode());

  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Reference to the tag with the main content of the page.
   * For this to work, the component should be added immediately after a tag with the [appMainSection] directive.
   */
  private page: HTMLElement = (inject(ElementRef).nativeElement as HTMLElement)
    .previousSibling as HTMLElement;

  private getActiveLink = signal<string | undefined>(undefined);

  private getHeadings = computed(() => {
    if (isPlatformServer(this.platformId)) {
      if (isDevMode()) {
        console.error(
          'This component should not be used for non-SSG/SPA pages.',
        );
      }
      return;
    }

    const selectors = [
      '[appMainSection] app-section-sub-heading',
      '[appMainSection] > h3',
    ];
    const headings = Array.from(
      this.page.querySelectorAll(selectors.join(',')),
    );

    return headings;
  });

  protected links = computed(() => {
    const links = this.getHeadings()?.map((element) => {
      const { id, children, localName, textContent } = element;
      const isSubHeading = localName === 'app-section-sub-heading';
      const label =
        (isSubHeading ? children[0].childNodes[0].textContent : textContent) ??
        '[DEV] Empty heading!';
      if (isDevMode() && id === '') {
        console.error(`[DEV] id missing for heading "${label}"`);
      }
      return {
        id,
        label,
        isNested: !isSubHeading,
        isActive: id === this.getActiveLink(),
      };
    });
    return links as SamePageAnchorLink[];
  });

  constructor() {
    this.getHeadings()?.forEach((element) =>
      this.createActiveLinkObserver().observe(element),
    );
  }

  ngAfterViewInit() {
    if (!this.pageNavTpl()) return;
    pageNavTemplate.set(this.pageNavTpl());
  }

  ngOnDestroy() {
    pageNavTemplate.set(null);
  }

  private createActiveLinkObserver() {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.getActiveLink.set(entry.target.id);
          } else {
            return;
          }
        });
      },
      { rootMargin: `0% 0% -70% 0%` },
    );
  }
}

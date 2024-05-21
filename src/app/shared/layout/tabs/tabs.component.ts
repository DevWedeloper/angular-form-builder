import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  BrnTabsContentDirective,
  BrnTabsDirective,
  BrnTabsListDirective,
  BrnTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-brain';

const tabBtn =
  'relative inline-flex h-9 items-center justify-center whitespace-nowrap rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-1 pb-3 pt-2 text-sm font-semibold text-muted-foreground shadow-none ring-offset-background transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-primary data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none';
const tabContent =
  'relative mt-2 rounded-md border border-border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    BrnTabsDirective,
    BrnTabsListDirective,
    BrnTabsTriggerDirective,
    BrnTabsContentDirective,
  ],
  host: {
    class: 'block',
  },
  template: `
    <div
      [brnTabs]="_tabValue()"
      class="block"
      (tabActivated)="onTabActivated($event)"
    >
      <div
        brnTabsList
        class="mb-4 inline-flex h-9 w-full items-center justify-start rounded-none border-b border-border bg-transparent p-0 text-muted-foreground"
        [attr.aria-label]="
          'Tablist showing ' + firstTab() + ' and ' + secondTab()
        "
      >
        <button class="${tabBtn}" [brnTabsTrigger]="firstTab()">
          {{ firstTab() }}
        </button>
        <button class="${tabBtn}" [brnTabsTrigger]="secondTab()">
          {{ secondTab() }}
        </button>
      </div>
      <div class="${tabContent}" [brnTabsContent]="firstTab()">
        <ng-content select="[firstTab]" />
      </div>
      <div class="${tabContent}" [brnTabsContent]="secondTab()">
        <ng-content select="[secondTab]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  firstTab = input.required<string>();
  secondTab = input.required<string>();
  value = input('');
  tabActivated = output<string>();

  protected _tabValue = computed(() =>
    this.value() === '' ? this.firstTab() : this.value(),
  );

  protected onTabActivated(value: string) {
    this.tabActivated.emit(value);
  }
}

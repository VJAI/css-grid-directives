import {Directive, ElementRef, Input, OnChanges, OnDestroy} from '@angular/core';
import {MediaSizeWatcher} from './watcher';

@Directive({
  selector: '[css-gi]'
})
export class GridItemDirective implements OnChanges, OnDestroy {

  @Input('css-gi-area')
  public area: string;

  @Input('css-gi-area-lg')
  public areaLg: string;

  @Input('css-gi-col-lg')
  public colLg: string;

  @Input('css-gi-col')
  public col: string;

  @Input('css-gi-row-lg')
  public rowLg: string;

  @Input('css-gi-row')
  public row: string;

  public currentMediaSize: string;

  private watcherUnSubscribeFn = () => {};

  constructor(private el: ElementRef, private watcher: MediaSizeWatcher) {
    this.currentMediaSize = this.watcher.getCurrentMedia();
    this.watcherUnSubscribeFn = this.watcher.watch((mediaSize: string) => {
      this.currentMediaSize = mediaSize;
      this.ngOnChanges();
    });
  }

  public ngOnChanges() {
    const nativeElement = this.el.nativeElement;
    this.clearStyles(nativeElement);

    const area = this.currentMediaSize === 'lg' ? this.areaLg || this.area : this.area;
    if (area) {
      nativeElement.style.setProperty('grid-area', area);
    }

    const row = this.currentMediaSize === 'lg' ? this.rowLg || this.row : this.row;
    if (row) {
      nativeElement.style.setProperty('grid-row', row);
    }

    const col = this.currentMediaSize === 'lg' ? this.colLg || this.col : this.col;
    if (col) {
      nativeElement.style.setProperty('grid-column', col);
    }
  }

  public ngOnDestroy() {
    this.watcherUnSubscribeFn();
    this.clearStyles(this.el.nativeElement);
  }

  private clearStyles(el) {
    el.style.removeProperty('grid-area');
    el.style.removeProperty('grid-row');
    el.style.removeProperty('grid-column');
  }
}

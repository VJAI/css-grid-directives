import {Directive, ElementRef, Input, OnChanges, OnDestroy} from '@angular/core';
import {MediaSizeWatcher} from './watcher';

@Directive({
  selector: '[css-g]'
})
export class GridContainerDirective implements OnChanges, OnDestroy {

  private _display = 'grid';

  public get display(): string {
    return this._display;
  }

  @Input('css-g')
  public set display(value: string) {
    this._display = value || 'grid';
  }

  private _displayLg = 'grid';

  public get displayLg(): string {
    return this._displayLg;
  }

  @Input('css-g-lg')
  public set displayLg(value: string) {
    this._displayLg = value || 'grid';
  }

  @Input('css-g-areas')
  public areas: string;

  @Input('css-g-areas-lg')
  public areasLg: string;

  @Input('css-g-cols')
  public cols: string;

  @Input('css-g-cols-lg')
  public colsLg: string;

  @Input('css-g-rows')
  public rows: string;

  @Input('css-g-rows-lg')
  public rowsLg: string;

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

    const display = this.currentMediaSize === 'lg' ? this.displayLg || this.display : this.display;
    if (display) {
      nativeElement.style.setProperty('display', display);
    }

    const areas = this.currentMediaSize === 'lg' ? this.areasLg || this.areas : this.areas;
    if (areas) {
      nativeElement.style.setProperty('grid-template-areas', areas);
    }

    const cols = this.currentMediaSize === 'lg' ? this.colsLg || this.cols : this.cols;
    if (cols) {
      nativeElement.style.setProperty('grid-template-columns', cols);
    }

    const rows = this.currentMediaSize === 'lg' ? this.rowsLg || this.rows : this.rows;
    if (rows) {
      nativeElement.style.setProperty('grid-template-rows', rows);
    }
  }

  public ngOnDestroy() {
    this.watcherUnSubscribeFn();
    this.clearStyles(this.el.nativeElement);
  }

  private clearStyles(el) {
    el.style.removeProperty('display');
    el.style.removeProperty('grid-template-areas');
    el.style.removeProperty('grid-template-cols');
    el.style.removeProperty('grid-template-rows');
  }
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GridContainerDirective} from './grid.container.directive';
import {GridItemDirective} from './grid.item.directive';
import {MediaSizeWatcher} from './watcher';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GridContainerDirective,
    GridItemDirective
  ],
  providers: [
    MediaSizeWatcher
  ],
  exports: [
    GridContainerDirective,
    GridItemDirective
  ]
})
export class SharedModule {
}

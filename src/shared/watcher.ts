import {Inject, Injectable, NgZone} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaSizeWatcher {

  private currentMediaSize: string;

  private subscribers: Array<(MediaQueryList) => void> = [];

  private mediaSizeQueryMap: Map<string, MediaQueryList> = new Map<string, MediaQueryList>([
    ['lg', window.matchMedia('(min-width: 768px)')],
    ['sm', window.matchMedia('(min-width: 0)')]
  ]);

  constructor(@Inject(NgZone) private ngZone: NgZone) {
    this.listen = this.listen.bind(this);
    this.mediaSizeQueryMap.forEach((value: MediaQueryList) => value.addListener(this.listen));
    this.listen();
  }

  public getCurrentMedia(): string {
    return this.currentMediaSize;
  }

  public watch(subscriber: (MediaQueryList) => void): () => void {
    this.subscribers.push(subscriber);
    return () => this.subscribers.splice(this.subscribers.length - 1, 1);
  }

  private listen(): void {
    for (const mediaSizeQuery of this.mediaSizeQueryMap) {
      const [mediaSize, query] = mediaSizeQuery;

      if (query.matches) {
        if (mediaSize !== this.currentMediaSize) {
          this.currentMediaSize = mediaSize;
          this.alertSubscribers();
        }

        break;
      }
    }
  }

  private alertSubscribers(): void {
    this.ngZone.run(() => {
      this.subscribers.forEach(subscriber => subscriber(this.currentMediaSize));
    });
  }
}

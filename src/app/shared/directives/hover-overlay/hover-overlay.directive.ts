import { Overlay, OverlayRef, OverlayPositionBuilder, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  input,
  inject,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
  TemplateRef,
  effect
} from '@angular/core';

const OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 8
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -8
  },
  {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 8
  }
];

@Directive({
  selector: '[appHoverOverlay]'
})
export class HoverOverlayDirective implements OnDestroy {
  template = input<TemplateRef<unknown> | null>(null, { alias: 'appHoverOverlay' });
  timeToShowInMs = input<number>(500);
  timeToHideInMs = input<number>(100);

  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef: OverlayRef | null = null;
  private mouseEnterListener: (() => void) | null = null;
  private mouseLeaveListener: (() => void) | null = null;
  private overlayMouseEnterListener: (() => void) | null = null;
  private overlayMouseLeaveListener: (() => void) | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const template = this.template();

      if (template) {
        this.attachHostListeners();
      } else {
        this.cleanup();
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private attachHostListeners(): void {
    if (this.isAlreadyAttached) {
      return;
    }

    this.mouseEnterListener = this.renderer.listen(
      this.elementRef.nativeElement,
      'mouseenter',
      () => this.scheduleShow()
    );

    this.mouseLeaveListener = this.renderer.listen(
      this.elementRef.nativeElement,
      'mouseleave',
      () => this.cancelShowAndScheduleHide()
    );
  }

  private get isAlreadyAttached(): boolean {
    return !!this.mouseEnterListener;
  }

  private scheduleShow(): void {
    if (this.isShowScheduledOrVisible() || !this.template()) {
      return;
    }

    this.showTimeout = setTimeout(() => {
      this.showOverlay();
      this.showTimeout = null;
    }, this.timeToShowInMs());
  }

  private cancelShowAndScheduleHide(): void {
    this.cancelShowTimeout();
    this.scheduleHide();
  }

  private showOverlay(): void {
    this.cancelHideTimeout();

    if (this.overlayRef || !this.template()) {
      return;
    }

    this.createOverlay();
    this.attachOverlayListeners();
  }

  private createOverlay(): void {
    const template = this.template();

    if (!template) {
      return;
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(OVERLAY_POSITIONS);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: false
    });

    const portal = new TemplatePortal(template, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  private attachOverlayListeners(): void {
    if (!this.overlayRef) {
      return;
    }

    const overlayElement = this.overlayRef.overlayElement;

    this.overlayMouseEnterListener = this.renderer.listen(
      overlayElement,
      'mouseenter',
      () => this.cancelHideTimeout()
    );

    this.overlayMouseLeaveListener = this.renderer.listen(
      overlayElement,
      'mouseleave',
      () => this.scheduleHide()
    );
  }

  private scheduleHide(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      this.hideOverlay();
    }, this.timeToHideInMs());
  }

  private hideOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    this.detachOverlayListeners();
  }

  private detachOverlayListeners(): void {
    if (this.overlayMouseEnterListener) {
      this.overlayMouseEnterListener();
      this.overlayMouseEnterListener = null;
    }

    if (this.overlayMouseLeaveListener) {
      this.overlayMouseLeaveListener();
      this.overlayMouseLeaveListener = null;
    }
  }

  private cancelShowTimeout(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  private cancelHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private isShowScheduledOrVisible(): boolean {
    return !!(this.showTimeout || this.overlayRef);
  }

  private cleanup(): void {
    this.cancelShowTimeout();
    this.cancelHideTimeout();
    this.hideOverlay();

    if (this.mouseEnterListener) {
      this.mouseEnterListener();
      this.mouseEnterListener = null;
    }

    if (this.mouseLeaveListener) {
      this.mouseLeaveListener();
      this.mouseLeaveListener = null;
    }
  }
}


import { Component, ElementRef, AfterViewInit, ViewChild, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-convenios',
  templateUrl: './convenios.html',
  styleUrls: ['./convenios.css'],
  standalone: true,
  imports: [CommonModule],
})
export class Convenios implements AfterViewInit {
  logos = [1, 2, 3, 4, 5, 6, 7, 8];
  logosLoop: number[] = [];

  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;

  private scrollAmount = 0;
  private speed = 0.5;
  private animationId: any;
  private isPaused = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.logosLoop = this.logos.concat(this.logos);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAnimation();
    }
  }

  private animate = () => {
    if (!this.isPaused) {
      const el = this.track.nativeElement;
      this.scrollAmount += this.speed;

      if (this.scrollAmount >= el.scrollWidth / 2) {
        this.scrollAmount = 0;
      }

      el.style.transform = `translateX(-${this.scrollAmount}px)`;
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  private startAnimation() {
    this.animationId = requestAnimationFrame(this.animate);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isPaused = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isPaused = false;
  }

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

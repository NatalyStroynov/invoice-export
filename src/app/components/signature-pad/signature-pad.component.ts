import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  forwardRef,
  OnDestroy,
  Renderer2
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import SignaturePad from 'signature_pad';
import { fromEvent, merge, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-signature',
  standalone: true,
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePadComponent),
      multi: true
    }
  ],
})
export class SignaturePadComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;

  private pointerUpSub!: Subscription;

  private onChange = (value: string | null) => {};
  private onTouched = () => {};

  constructor() {}

  ngAfterViewInit() {
  const canvas = this.canvasRef.nativeElement;
  
  console.log('Canvas offsetWidth:', canvas.offsetWidth);
  console.log('Canvas offsetHeight:', canvas.offsetHeight);

  this.setCanvasSize(canvas);
  this.signaturePad = new SignaturePad(canvas);

  const pointerUp$ = fromEvent(canvas, 'pointerup');
  const touchEnd$ = fromEvent(canvas, 'touchend');

  this.pointerUpSub = merge(pointerUp$, touchEnd$)
    .pipe(debounceTime(100))
    .subscribe(() => this.emitSignature());
}


private emitSignature() {
 // const data = this.signaturePad.toData();
  console.log('Is empty?', this.signaturePad.isEmpty());
  if (this.signaturePad.isEmpty()) {
    this.onChange(null);
    console.log('Emitting NULL');
  } else {
    this.onChange(this.signaturePad.toDataURL());
    console.log('Emitting data URL:', this.signaturePad.toDataURL());
  }
   this.onTouched();
}

  clearSignature() {
    this.signaturePad.clear();
    this.onChange(null);
    this.onTouched();
  }

  private setCanvasSize(canvas: HTMLCanvasElement) {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = 200 * ratio; // фиксированная высота
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(ratio, ratio);
  }
}

  writeValue(value: any): void {
    if (!value) {
      if (this.signaturePad) {
      this.clearSignature();
    }
  }
}

  registerOnChange(fn: any): void {
    console.log('REGISTER onChange');
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

 /* setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.signaturePad.off();
    } else {
      this.signaturePad.on();
    }
  }*/

  ngOnDestroy() {
    this.pointerUpSub?.unsubscribe();
  }
}



/*import { Component, ElementRef, ViewChild, AfterViewInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature',
  standalone: true,
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePadComponent),
      multi: true
    }
  ]
})
export class SignaturePadComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;

  private onChange = (value: string | null) => {};
  private onTouched = () => {};

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.signaturePad = new SignaturePad(canvas);

    (this.signaturePad as any).onEnd = () => {
      if (this.signaturePad.isEmpty()) {
        this.onChange(null);
      } else {
        const dataUrl = this.signaturePad.toDataURL();
        this.onChange(dataUrl);
      }
    };

    this.resizeCanvas();
  }

  clearSignature() {
    this.signaturePad.clear();
    this.onChange(null);
  }

  // Make sure the canvas fits its container
  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);
    this.signaturePad.clear();
  }

  // ControlValueAccessor
  writeValue(value: any): void {
    if (!value) {
      this.clearSignature();
    } else {
      // Если нужно, можно нарисовать подпись заново — signature_pad умеет загружать dataURL
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.signaturePad.off();
    } else {
      this.signaturePad.on();
    }
  }
}
*/
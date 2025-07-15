import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignaturePadComponent } from './signature-pad.component';

describe('SignaturePadComponent', () => {
  let component: SignaturePadComponent;
  let fixture: ComponentFixture<SignaturePadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignaturePadComponent] // standalone компонент
    }).compileComponents();

    fixture = TestBed.createComponent(SignaturePadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onChange(null) when clearSignature is called', () => {
    const onChangeSpy = spyOn<any>(component, 'onChange');
    (component as any).signaturePad = { clear: jasmine.createSpy('clear') };
    component.clearSignature();
    expect((component as any).signaturePad.clear).toHaveBeenCalled();
    expect(onChangeSpy).toHaveBeenCalledWith(null);
  });

  it('should register onChange and call it', () => {
    const fn = jasmine.createSpy('onChange');
    component.registerOnChange(fn);
    (component as any).onChange('test');
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should register onTouched and call it', () => {
    const fn = jasmine.createSpy('onTouched');
    component.registerOnTouched(fn);
    (component as any).onTouched();
    expect(fn).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    (component as any).pointerUpSub = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
    component.ngOnDestroy();
    expect((component as any).pointerUpSub.unsubscribe).toHaveBeenCalled();
  });
});

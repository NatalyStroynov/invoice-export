import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignaturePadComponent } from './components/signature-pad/signature-pad.component';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SignaturePadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Invoice Submission';
  invoiceForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.invoiceForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', this.optionalPhoneValidator],
      invoiceNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      invoiceDate: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      signature: [null, Validators.required]
    });
  }

  optionalPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || value.trim() === '') {
      return null;
    }

    const phoneRegex = /^[0-9]{6,15}$/;
    return phoneRegex.test(value) ? null : { invalidPhone: true };
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      console.log('Form Submitted!', this.invoiceForm.value);
      this.invoiceForm.markAllAsTouched();
      const formValue = this.invoiceForm.value;


      const doc = new jsPDF();


      let y = 20;


      // BAckground color
      doc.setFillColor(245, 245, 255);
      doc.roundedRect(20, y, 170, 220, 4, 4, 'F'); // x, y, w, h, radius

      // Title
      doc.setFontSize(16);
      doc.setTextColor(54, 54, 117);
      doc.setFont('helvetica', 'bold');
      doc.text('Invoice data', 105, y + 12, { align: 'center' });

      // 🧾 Invoice # и Date
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text('Invoice Number', 30, y + 25);
      doc.text('Invoice Date', 135, y + 25);

      doc.setFont('helvetica', 'bold');
      doc.text(formValue.invoiceNumber, 30, y + 32);
      const formattedDate = new Intl.DateTimeFormat('en-GB').format(formValue.invoiceDate);
      doc.text(formattedDate, 135, y + 32);

      // Form
      y += 45;
      const lineHeight = 20;

      const label = (text: string, ypos: number) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`${text}*`, 30, ypos);
      };

      const value = (val: string, ypos: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setDrawColor(200);
        doc.rect(30, ypos + 2, 150, 8, 'D');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(val, 35, ypos + 7);
      };

      label('Full Name', y); value(formValue.fullName, y); y += lineHeight;
      label('Email', y); value(formValue.email, y); y += lineHeight;
      label('Phone Number', y); value(formValue.phoneNumber, y); y += lineHeight;
      label('Amount', y); value(`$${formValue.amount}`, y); y += lineHeight;


      // Signature
      y += 4;
      label('Signature', y);
      doc.setDrawColor(180);
      doc.rect(30, y + 4, 150, 45); // border

      if (formValue.signature) {
        doc.addImage(formValue.signature, 'PNG', 32, y + 6, 100, 40);
      }

      //  Save pdf  

      const pdfBlob = doc.output('blob');

      // Можно передать FormData или как File
      const formData = new FormData();
      formData.append('file', pdfBlob, `invoice-${formValue.invoiceNumber}.pdf`);


      this.http.post(`${environment.apiUrl}/api/upload-pdf`, formData).subscribe({
        next: (res) => {
          console.log('PDF upload success', res);
          this.sendFormData(formValue); // 5️⃣ Отправляем JSON, если нужно отдельно
        },
        error: (err) => {
          console.error('PDF upload failed', err);
          alert('Error uploading PDF. Please try again or contact support.');
        }
      });




    } else {
      console.log('Form is invalid');
    }
  }
  sendFormData(formValue: any) {
    this.http.post(`${environment.apiUrl}/api/invoices`, formValue).subscribe({
      next: (res) => {
        console.log('Form data success', res);
        alert('Invoice submitted successfully!');
      },
      error: (err) => {
        console.error('Form data failed', err);
        alert('Error sending invoice data. Please try again or contact support.');
      }
    });
  }
}

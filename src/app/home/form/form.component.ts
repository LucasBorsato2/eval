import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DatabaseService, MessageData } from '../../services/database.service';
import { EmailService } from '../../services/email.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class FormComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    category: ['', Validators.required],
    message: ['', Validators.required]
  });
  
  submitted = false;
  showHistory = false;
  selectedFile: File | null = null;
  selectedPhoto: string | null = null;
  messages$ = this.databaseService.messages$;
  selectedMessage: MessageData | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private databaseService: DatabaseService,
    private emailService: EmailService,
    private toastController: ToastController
  ) {}

  private resetForm() {
    this.form.reset();
    this.submitted = false;
    this.selectedFile = null;
    this.selectedPhoto = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      const messageData: MessageData = {
        name: this.form.value.name,
        email: this.form.value.email,
        category: this.form.value.category,
        message: this.form.value.message,
        attachment: this.selectedFile?.name,
        timestamp: Date.now()
      };

      try {
        const dbSuccess = await this.databaseService.saveMessage(messageData);
        
        if (!dbSuccess) {
          return;
        }

        try {
          await this.emailService.sendEmail(messageData);
          await this.showToast('Message envoyé avec succès !', 'success');
          this.resetForm();
          this.showHistory = true;
        } catch {
          this.resetForm();
          this.showHistory = true;
        }
      } catch {
        this.resetForm();
      }
    } else {
      this.resetForm();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.showToast(`Fichier sélectionné : ${file.name}`, 'success');
    }
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      if (image.base64String) {
        this.selectedPhoto = image.base64String;
        // Convertir l'image base64 en File
        const byteCharacters = atob(image.base64String);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: 'image/jpeg' });
        this.selectedFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        this.showToast('Photo prise avec succès !', 'success');
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      this.showToast('Erreur lors de la prise de photo', 'danger');
    }
  }

  showHistoryModal() {
    this.showHistory = true;
  }

  closeHistory() {
    this.showHistory = false;
  }

  showMessageDetail(message: MessageData) {
    this.selectedMessage = message;
    this.showHistory = false;
  }

  closeMessageDetail() {
    this.selectedMessage = null;
    this.showHistory = true;
  }

  getCategoryColor(category: string): string {
    switch (category.toLowerCase()) {
      case 'question':
        return 'primary';
      case 'suggestion':
        return 'success';
      case 'probleme':
        return 'danger';
      default:
        return 'medium';
    }
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  get f() {
    return this.form.controls;
  }
}

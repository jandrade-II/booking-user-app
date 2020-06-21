import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController,
  ) { }

  async presentToast(message: string, position, color) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      duration: 3000,
      color: color
    });
    toast.present();
  }
}

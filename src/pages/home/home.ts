import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import * as Tesseract from 'tesseract.js'
import { Camera, PictureSourceType } from '@ionic-native/camera';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedImage: string;
  imageText: string;

  constructor(public navCtrl: NavController, private camera: Camera, private actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController,public toastCtrl: ToastController) {

  }
  selectSource() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
    });
  }
  presentLoading() {
    return this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
  }

  recognizeImage() {
    const { TesseractWorker, OEM } = Tesseract;

    this.presentLoading().present();
    Tesseract.recognize(this.selectedImage,'por',{
     'tessedit_char_whitelist': '0123456789ABCDEFGHIJLMNOPQRSTUVXWZ',
    })
      .progress(message => {
        console.log(message.status);

      })
      .catch(err => console.error(err))
      .then(result => {
        console.log("entrou aqui");
        this.imageText = result.text;
        if(this.imageText ==""){
          const toast = this.toastCtrl.create({
            message: 'O algortimo não conseguiu identificar o texto, tire uma imagem melhor',
            duration: 3000
          });
          toast.present();

        }
        this.presentLoading().dismiss();

      })
      .finally(resultOrError => {
        // this.progress.complete();
        console.log(resultOrError);
        this.presentLoading().dismiss();


      });
  }


}


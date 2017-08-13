import { Component, ViewChild, ElementRef } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { UploadService } from '../../services/upload.service';
import { Upload, Avatar } from '../../shared/model/upload.model';

@Component({
    selector: 'image-app-cropper',
    templateUrl: './image.cropper.component.html',
    styleUrls: ['./image.cropper.component.css'],
})

export class ImageCropper {

    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
    @ViewChild('avatar') avatar: ElementRef;

    data: any;
    cropperSettings: CropperSettings;
    currentUpload: Avatar;
    currentUploadMini: Avatar;
    selectedFiles: FileList;
    fileAvatar: any;

    constructor(private upSvc: UploadService) {

        // this.cropperSettings = new CropperSettings();


        // this.data = {};

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.croppedWidth =100;
        this.cropperSettings.croppedHeight = 100;
        this.cropperSettings.canvasWidth = 600;
        this.cropperSettings.canvasHeight = 400;
        this.data = {};

    }

    fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    this.fileAvatar = file;
    console.log(file);
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
    };
    console.log(file);
    myReader.readAsDataURL(file);
    
    
    }

    imageData() {
        console.log(this.data);
    }

    detectFiles(event) {
      this.selectedFiles = event.target.files;
    }

    uploadSingle() {
    // console.log(this.avatar.nativeElement);
    // // let file = this.avatar;
    // let file: File = this.avatar.nativeElement
    // console.log(file);
    this.currentUpload = new Avatar(this.fileAvatar);
    this.currentUploadMini = new Avatar(this.dataURItoBlob(this.data.image));    
    this.upSvc.pushAvatar(this.currentUpload, this.currentUploadMini); 
    }

    getBase64Image(img) {
  // Create an empty canvas element
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Copy the image contents to the canvas
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to
  // guess the original format, but be aware the using "image/jpg"
  // will re-encode the image.
  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}



  public dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see stack overflow answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

}
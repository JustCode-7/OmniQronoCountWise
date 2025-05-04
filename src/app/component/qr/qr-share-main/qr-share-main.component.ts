import {Component} from '@angular/core';
import {QrcodeShareService} from "../../../service/qrcode-share.service";
import {MatTabsModule} from "@angular/material/tabs";
import {GenerateQrCodeComponent} from "../generate-qr-code/generate-qr-code.component";
import {CamScanQrComponent} from "../cam-scan-qr/cam-scan-qr.component";
import {ScanQrFromImageComponent} from "../scan-qr-from-image/scan-qr-from-image.component";

@Component({
    selector: 'app-qr-share-main',
    templateUrl: './qr-share-main.component.html',
    standalone: true,
    imports: [MatTabsModule, GenerateQrCodeComponent, CamScanQrComponent, ScanQrFromImageComponent]
})
export class QrShareMainComponent {
    constructor(public qrcodeService: QrcodeShareService) {
    }

}

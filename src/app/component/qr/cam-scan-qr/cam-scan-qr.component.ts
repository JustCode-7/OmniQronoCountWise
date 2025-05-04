import {Component} from '@angular/core';
import {QrcodeShareService} from "../../../service/qrcode-share.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-cam-scan-qr',
    templateUrl: './cam-scan-qr.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule
    ]
})
export class CamScanQrComponent {
    constructor(public qrShareService: QrcodeShareService) {
    }

}

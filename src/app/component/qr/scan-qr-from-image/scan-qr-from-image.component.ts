import {Component} from '@angular/core';
import {QrcodeShareService} from "../../../service/qrcode-share.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatListModule, MatSelectionList} from "@angular/material/list";
import {NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
    selector: 'app-scan-qr-from-image',
    templateUrl: './scan-qr-from-image.component.html',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatSelectionList,
        MatListModule,
        NgStyle,
        NgIf,
        NgForOf
    ]
})
export class ScanQrFromImageComponent {


    constructor(public qrShareService: QrcodeShareService) {
    }

}

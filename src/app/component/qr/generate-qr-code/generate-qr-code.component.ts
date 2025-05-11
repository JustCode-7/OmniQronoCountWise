import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild} from "@angular/core"
import {DomSanitizer, SafeUrl} from "@angular/platform-browser"
import {QRCodeConfigType, QRCodeErrorCorrectionLevel, QRCodeVersion,} from "./types"
import {QrcodeShareService} from "../../../service/qrcode-share.service";
import {StorageService} from "../../../service/storage.service";
import {BehaviorSubject} from "rxjs";
import QRCode, {QRCodeToStringOptions} from 'qrcode'
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

@Component({
    selector: 'app-generate-qr-code',
    templateUrl: 'generate-qr-code.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        NgStyle,
        FormsModule,
        NgForOf,
        NgIf,
        MatInputModule
    ]
})
export class GenerateQrCodeComponent {
    QRCode = QRCode;
    public value: string = "https://www.google.de/";
    public allowEmptyString = true
    public hintColor = "#ec1616"
    public colorForeground = "#000000ff"
    public colorBackground = "#ffffffff"

    public qrdata = "";
    public qrCodeversion?: QRCodeVersion;
    public qrCodeErrorCorrLevel: QRCodeErrorCorrectionLevel = "H";
    @Output() qrCodeURL = new EventEmitter<SafeUrl>()
    @ViewChild("qrcElement", {static: true}) public qrcElement!: ElementRef
    config: QRCodeConfigType = {
        color: {
            dark: this.colorForeground,
            light: this.colorBackground,
        },
        errorCorrectionLevel: this.qrCodeErrorCorrLevel,
        margin: 7,
        scale: 2,
        type: "svg",
        version: this.qrCodeversion,
        width: 100,
    }
    latestScans: string[] = [];
    public errorMsg = new BehaviorSubject<string>("");
    private revalidationVersion: QRCodeVersion | undefined;

    constructor(
        private renderer: Renderer2, 
        private sanitizer: DomSanitizer, 
        public qrcodeService: QrcodeShareService,
        private storageService: StorageService
    ) {
        this.value = "https://www.google.de/";
        this.latestScans = this.storageService.getQrCodeLatestScans() ?? [];
        this.initialGenerateQR();
    }

    isQRCodeDataValid() {
        if (!this.isValidQrCodeText(this.qrdata)) {
            throw new Error(
                " Field `qrdata` is empty, set 'allowEmptyString=\"true\"' to overwrite this behaviour."
            )
        }
        // This is a workaround to allow an empty string as qrdata
        if (this.isValidQrCodeText(this.qrdata) && this.qrdata === "") {
            this.qrdata = " "
        }
    }

    versionCheck() {
        if (this.qrCodeversion && this.qrCodeversion > 40) {
            console.warn(" max value for `version` is 40");
            this.qrCodeversion = 40;
        }
        if (this.qrCodeversion && this.qrCodeversion < 1) {
            console.warn("`min value for `version` is 1");
            this.qrCodeversion = 1;
        }
        if (this.qrCodeversion !== undefined && isNaN(this.qrCodeversion)) {
            console.warn(
                " version should be a number, defaulting to auto."
            );
            this.qrCodeversion = undefined;
        }
        if (this.revalidationVersion !== undefined && this.revalidationVersion > this.qrCodeversion!) {
            this.qrCodeversion = this.revalidationVersion;
        }
    }

    emitQRCodeURL(element: HTMLCanvasElement | HTMLImageElement | SVGSVGElement) {
        const className = element.constructor.name
        if (className === SVGSVGElement.name) {
            const svgHTML = element.outerHTML
            const blob = new Blob([svgHTML], {type: "image/svg+xml"})
            const urlSvg = URL.createObjectURL(blob)
            const urlSanitized = this.sanitizer.bypassSecurityTrustUrl(urlSvg)
            this.qrCodeURL.emit(urlSanitized)
            return
        }

        let urlImage = ""

        if (className === HTMLCanvasElement.name) {
            urlImage = (element as HTMLCanvasElement).toDataURL("image/png")
        }

        if (className === HTMLImageElement.name) {
            urlImage = (element as HTMLImageElement).src
        }

        fetch(urlImage)
            .then((urlResponse: Response) => urlResponse.blob())
            .then((blob: Blob) => URL.createObjectURL(blob))
            .then((url: string) => this.sanitizer.bypassSecurityTrustUrl(url))
            .then((urlSanitized: SafeUrl) => {
                this.qrCodeURL.emit(urlSanitized)
            })
            .catch((error) => {
                console.error(
                    " Error when fetching image/png URL: " + error
                )
            })
    }

    svg() {
        const svgParentElement: HTMLElement =
            this.renderer.createElement("div")
        svgParentElement.setAttribute("class", "vw-90 mt-9")
        this.toSVG(this.config)
            .then((svgString: string) => {
                this.renderer.setProperty(
                    svgParentElement,
                    "innerHTML",
                    svgString
                )
                const svgElement = svgParentElement.firstChild as SVGSVGElement
                this.renderer.setAttribute(svgElement, "height", '100%')
                this.renderer.setAttribute(svgElement, "width", '100%')
                this.renderElement(svgElement)
                this.emitQRCodeURL(svgElement)
            })
            .catch((e) => {
                if (e.message.includes("The amount of data is too big")) {
                    if (this.qrCodeErrorCorrLevel === "L") {
                        this.errorMsg.next(e.message);
                        this.value = "sorry dude"
                        console.error(" svg error:", e)
                    }
                    if (this.qrCodeErrorCorrLevel === "M") {
                        this.qrCodeErrorCorrLevel = "L";
                        this.svg();
                    }
                    if (this.qrCodeErrorCorrLevel === "Q") {
                        this.qrCodeErrorCorrLevel = "M";
                        this.svg();
                    }
                    if (this.qrCodeErrorCorrLevel === "H") {
                        this.qrCodeErrorCorrLevel = "Q";
                        this.svg();
                    }
                }
                if (e.toString().includes("version")) {
                    console.error("qrCode-version-error: %s + try to revalidate version and reprint QR-Code", e)
                    this.revalidationVersion = e.message.substring(e.message.lastIndexOf(":") + 1, e.message.lastIndexOf("."))
                    this.qrCodeversion = this.revalidationVersion;
                    // dialog open : do want to revalidate the
                    this.svg();
                }

            })
    }

    async initialGenerateQR() {
        this.setDefaults();
        this.qrdata = this.value;
        if (this.value !== '') {
            await this.createQRCode()
        }

    }

    async generateQROnClick(value: string) {
        this.setDefaults();
        if (value === '') {
            this.errorMsg.next("no empty input allowed")
            return;
        }
        if (this.latestScans.length > 5) {
            this.latestScans.shift();
            this.latestScans.push(value);
        } else {
            this.latestScans.push(value);
        }
        this.saveInLocalSorage(this.latestScans);
        this.qrdata = value;
        await this.createQRCode()
    }

    getItemOfLatestScans(value: string) {
        this.value = value;
        this.initialGenerateQR()
    }

    saveInLocalSorage(items: string[]) {
        this.storageService.setQrCodeLatestScans(items);
    }

    getListFromLocalStorage() {
        return this.storageService.getQrCodeLatestScans();
    }

    clearList() {
        this.latestScans = [];
        this.storageService.clearQrCodeScans();
        window.location.reload();
    }

    protected isValidQrCodeText(data: string | null): boolean {
        if (!this.allowEmptyString) {
            return !(
                typeof data === "undefined" ||
                data === "" ||
                data === "null" ||
                data === null
            )
        }
        return !(typeof data === "undefined")
    }

    private setDefaults() {
        this.qrCodeErrorCorrLevel = 'H';
        this.errorMsg.next('');
    }

    private toSVG(qrCodeConfig: QRCodeConfigType): Promise<any> {
        return new Promise(
            (resolve: (arg: any) => any, reject: (arg: any) => any) => {

                this.QRCode.toString(
                    this.qrdata,
                    qrCodeConfig as QRCodeToStringOptions,
                    (err: Error | null | undefined, url: string) => {
                        if (err) {
                            reject(err)
                            return
                        } else {
                            resolve(url)
                        }
                    }
                )

            }
        )
    }

    private renderElement(element: Element): void {
        for (const node of this.qrcElement.nativeElement.childNodes) {
            this.renderer.removeChild(this.qrcElement.nativeElement, node)
        }
        this.renderer.appendChild(this.qrcElement.nativeElement, element)
    }

    private async createQRCode(): Promise<void> {
        this.versionCheck();
        try {
            this.isQRCodeDataValid()
            this.svg();
        } catch (e: any) {
            console.error("Error generating QR Code:", e.message)
        }
    }
}

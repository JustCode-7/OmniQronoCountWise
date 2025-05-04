import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import {environment} from "../environments/environment";
import {MatTabsModule} from "@angular/material/tabs";

export interface TabMenueItems {
    text: string;
    route: string;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
    ],
    templateUrl: 'app.component.html',
    styles: []
})
export class AppComponent {
    public title = 'OmniQronoCountWise';
    appVersion: string = environment.appVersion;
    tabs: TabMenueItems[] = [
        {text: "Bad-Behavior-Counter", route: "behavior-counter"},
        {text: "Work-Timer", route: "timer"},
        {text: "QR-Code", route: "qr"},
        {text: "TT-Counter", route: "tt-counter"},
    ];

    constructor(private router: Router) {
        // Navigate to the first tab by default
        this.navigateToTab(0);
    }

    navigateToTab(index: number): void {
        if (index >= 0 && index < this.tabs.length) {
            this.router.navigateByUrl(this.tabs[index].route);
        }
    }
}

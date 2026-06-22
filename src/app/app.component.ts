import {Component, inject, OnInit, Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import {environment} from "../environments/environment";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {StorageService} from "./service/storage.service";
import {PwaInstallService} from "./service/pwa-install.service";

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
        MatSnackBarModule,
        MatMenuModule,
    ],
    templateUrl: 'app.component.html',
    styles: []
})
export class AppComponent implements OnInit {
    public title = 'OmniQronoCountWise';
    appVersion: string = environment.appVersion;
    tabs: TabMenueItems[] = [
        {text: "(Bad)Behavior-Counter", route: "behavior-counter"},
        {text: "ZufallsGen", route: "randomize"},
        {text: "Planningpoker", route: "planning"},
        {text: "Work-Timer", route: "timer"},
        {text: "QR-Code", route: "qr"},
        {text: "Counter", route: "counter"},
    ];

    // Available themes
    availableThemes = [
        {name: 'Purple-Green', cssFile: 'purple-green.css'},
        {name: 'Indigo-Pink', cssFile: 'indigo-pink.css'},
        {name: 'Pink-Blue Grey', cssFile: 'pink-bluegrey.css'},
        {name: 'Deep Purple-Amber', cssFile: 'deeppurple-amber.css'},
        {name: 'Green-Dark', cssFile: 'green-dark.css'}
    ];

    // Current theme
    currentTheme = this.availableThemes[0];

    private readonly pwa = inject(PwaInstallService);

    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private renderer: Renderer2,
        private storageService: StorageService
    ) {
        // Navigate to the first tab by default
        this.navigateToTab(0);

        // Migrate existing data to the new storage service
        this.storageService.migrateData();
    }

    ngOnInit(): void {
        // Load saved theme preference
        const theme = this.storageService.getTheme();
        if (theme) {
            // Find the matching theme in availableThemes
            const matchedTheme = this.availableThemes.find(t => t.name === theme.name);
            if (matchedTheme) {
                // Apply the saved theme
                this.changeTheme(matchedTheme);
            }
        } else {
            // Apply default theme if no saved preference
            this.changeTheme(this.availableThemes[0]);
        }


        this.pwa.askToInstall();
    }

    navigateToTab(index: number): void {
        if (index >= 0 && index < this.tabs.length) {
            this.router.navigateByUrl(this.tabs[index].route);
        }
    }

    // Method to show the installation prompt
    installApp(): void {
        this.pwa.triggerInstall()
    }

    // Method to change the theme
    changeTheme(theme: any): void {
        // Remove current theme
        const head = document.getElementsByTagName('head')[0];
        const links = document.getElementsByTagName('link');

        // Find and remove the current theme link
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            if (link.href.includes('assets/themes')) {
                this.renderer.removeChild(head, link);
                break;
            }
        }

        // Add new theme link
        const newLink = this.renderer.createElement('link');
        this.renderer.setAttribute(newLink, 'rel', 'stylesheet');
        this.renderer.setAttribute(newLink, 'href', `./assets/themes/${theme.cssFile}`);
        this.renderer.appendChild(head, newLink);

        // Update current theme
        this.currentTheme = theme;

        // Save theme preference using the storage service
        this.storageService.setTheme(theme);
    }

    // Method to clear the cache (localStorage)
    clearCache(): void {
        this.storageService.clearCache();
        this.snackBar.open('Cache wurde geleert', 'OK', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }
}

import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import {environment} from "../environments/environment";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

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
    ],
    templateUrl: 'app.component.html',
    styles: []
})
export class AppComponent implements OnInit {
    public title = 'OmniQronoCountWise';
    appVersion: string = environment.appVersion;
    tabs: TabMenueItems[] = [
        {text: "Bad-Behavior-Counter", route: "behavior-counter"},
        {text: "Work-Timer", route: "timer"},
        {text: "QR-Code", route: "qr"},
        {text: "TT-Counter", route: "tt-counter"},
    ];

    // Property to store the deferred installation prompt
    private deferredPrompt: any;
    showInstallButton = false;

    constructor(private router: Router, private snackBar: MatSnackBar) {
        // Navigate to the first tab by default
        this.navigateToTab(0);
    }

    ngOnInit(): void {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the default browser install prompt
            e.preventDefault();
            // Store the event for later use
            this.deferredPrompt = e;
            // Show the install button
            this.showInstallButton = true;

            // Show a snackbar notification to prompt installation
            this.showInstallPrompt();
        });

        // Listen for the appinstalled event
        window.addEventListener('appinstalled', () => {
            // Hide the install button when the app is installed
            this.showInstallButton = false;
            // Clear the deferred prompt
            this.deferredPrompt = null;
            console.log('App was installed');
        });
    }

    navigateToTab(index: number): void {
        if (index >= 0 && index < this.tabs.length) {
            this.router.navigateByUrl(this.tabs[index].route);
        }
    }

    // Method to show the installation prompt
    installApp(): void {
        if (!this.deferredPrompt) {
            return;
        }

        // Show the installation prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice.then((choiceResult: {outcome: string}) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Clear the deferred prompt variable
            this.deferredPrompt = null;
            // Hide the install button
            this.showInstallButton = false;
        });
    }

    // Method to show a snackbar notification prompting installation
    showInstallPrompt(): void {
        const snackBarRef = this.snackBar.open(
            'Diese App kann installiert werden', 
            'Installieren', 
            {
                duration: 10000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            }
        );

        snackBarRef.onAction().subscribe(() => {
            this.installApp();
        });
    }
}

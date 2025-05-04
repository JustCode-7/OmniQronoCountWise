import {Routes} from '@angular/router';
import {TimerComponent} from "./component/timer/timer.component";
import {QrShareMainComponent} from "./component/qr/qr-share-main/qr-share-main.component";


export const routes: Routes = [
    {path: '', redirectTo: 'timer', pathMatch: 'full'},
    {path: 'timer', component: TimerComponent},
    {path: 'behavior-counter', component: TimerComponent},
    {path: 'qr', component: QrShareMainComponent},
    {path: 'tt-counter', component: TimerComponent},
];

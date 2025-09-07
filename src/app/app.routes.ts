import {Routes} from '@angular/router';
import {TimerComponent} from "./component/timer/timer.component";
import {QrShareMainComponent} from "./component/qr/qr-share-main/qr-share-main.component";
import {BehaviorCounterComponent} from "./component/behavior-counter/behavior-counter.component";
import {VariableCounterComponent} from "./component/variable-counter/variable-counter.component";


export const routes: Routes = [
    {path: '', redirectTo: 'behavior-counter', pathMatch: 'full'},
    {path: 'timer', component: TimerComponent},
    {path: 'behavior-counter', component: BehaviorCounterComponent},
    {path: 'qr', component: QrShareMainComponent},
    {path: 'counter', component: VariableCounterComponent},
];

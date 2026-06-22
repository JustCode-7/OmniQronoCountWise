import {Routes} from '@angular/router';
import {TimerComponent} from "./component/timer/timer.component";
import {QrShareMainComponent} from "./component/qr/qr-share-main/qr-share-main.component";
import {BehaviorCounterComponent} from "./component/behavior-counter/behavior-counter.component";
import {VariableCounterComponent} from "./component/variable-counter/variable-counter.component";
import {RandomizeMainComponent} from "./component/randomize/components/randomize-main/randomize-main.component";
import {PlanningPokerComponent} from "./component/planning/components/planning-poker/planning-poker.component";


export const routes: Routes = [
    {path: '', redirectTo: 'behavior-counter', pathMatch: 'full'},
    {path: 'timer', component: TimerComponent},
    {path: 'randomize', component: RandomizeMainComponent},
    {path: 'planning', component: PlanningPokerComponent},
    {path: 'behavior-counter', component: BehaviorCounterComponent},
    {path: 'qr', component: QrShareMainComponent},
    {path: 'counter', component: VariableCounterComponent},
];

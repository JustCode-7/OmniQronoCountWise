import {Component} from '@angular/core';
import {PlanningPokerService} from "../../service/planning-poker.service";

@Component({
  selector: 'app-your-choice-buttom-sheet',
  templateUrl: './your-choice-buttom-sheet.component.html',
  standalone: true
})
export class YourChoiceButtomSheetComponent {

  constructor(public readonly pokerService: PlanningPokerService) {
  }
}

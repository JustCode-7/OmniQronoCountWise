import {Injectable} from '@angular/core';
import {
  YourChoiceButtomSheetComponent
} from "../components/your-choice-buttom-sheet/your-choice-buttom-sheet.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";

@Injectable({
  providedIn: 'root'
})
export class PlanningPokerService {
  yourChoice: any;
  indexOfCard: any;

  constructor(private _bottomSheet: MatBottomSheet) {
  }

  setChoice(cardIndex: number, pickedCard: string) {
    this.yourChoice = pickedCard;
    this.indexOfCard = cardIndex;
    this._bottomSheet.open(YourChoiceButtomSheetComponent);
  }
}

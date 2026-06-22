import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlanningPokerService} from "../../service/planning-poker.service";
import {NgForOf} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-planning-poker',
  templateUrl: './planning-poker.component.html',
  styleUrls: ['./planning-poker.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class PlanningPokerComponent implements OnInit {
  cardArr: any[] = [];

  @ViewChild("myCard", {read: ElementRef}) myCard: ElementRef | undefined;
  style_color2: string = 'width:70px; height:100px;background-color:blueviolet';
  style_color1: string = 'width:70px; height:100px;background-color:blue';
  style_card: string = 'width:70px; height:100px;';

  constructor(myCard: ElementRef, public readonly pokerService: PlanningPokerService) {
  }

  ngOnInit(): void {
    this.cardArr = this.createFibonacci();
  }

  createFibonacci() {
    let arr = [];
    let fiboArr: number[] = [];
    for (let i = 0; i <= 12; i++) {
      arr[i] = i + 1;
    }
    arr.forEach((el, i) => {
      if (i == 0 || i == 1) {
        fiboArr.push(1);
      } else {
        fiboArr.push(fiboArr[i - 1] + fiboArr[i - 2]);
      }
    });
    return fiboArr.splice(1, fiboArr.length - 1);
  }

  changeState(cardIndex: number, pickedCard: string) {
    this.pokerService.setChoice(cardIndex, pickedCard);
    if (this.style_card.includes(this.style_color2)) {
      this.style_card = this.style_color1;
    } else {
      this.style_card = this.style_color2;
    }
    //TODO: use ElementRef to change a single card

    // let i = cardIndex;
    // this.cardArr.forEach((card, index) => {
    //   this.myCard = card;
    //   if (index == i) {
    //     console.log("Hello " + index + " " + card + " " + this.myCard);
    //   }
    // });
  }
}

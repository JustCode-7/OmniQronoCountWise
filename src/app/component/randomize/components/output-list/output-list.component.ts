import {Component, OnInit} from '@angular/core';
import {RandomServiceService} from '../../services/random-service.service';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-output-table',
  templateUrl: './output-list.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    NgForOf,
    MatExpansionModule,
    MatCardModule
  ]
})
export class OutputListComponent implements OnInit {

  value = 'Fill me with text';
  index: number = 0;
  ind1 = 1;
  randomizedService: RandomServiceService;

  constructor(randomizedService: RandomServiceService) {
    this.randomizedService = randomizedService;
  }

  ngOnInit(): void {
    if (this.randomizedService.getItemFromCache()?.length == 0) {
      this.randomizedService.setItemsToCache();
    } else {
      this.randomizedService.reloadFromCache();
    }
  }
}

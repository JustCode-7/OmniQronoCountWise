import {Component} from '@angular/core';
import {RandomServiceService} from '../../services/random-service.service';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-input-table',
  templateUrl: './user-input.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class UserInputComponent {
  value = 'Fill me with text';
  index: number = 0;
  randomizedService: RandomServiceService;

  constructor(randomizedService: RandomServiceService) {
    this.randomizedService = randomizedService;
  }

  addName(name: string) {
    if (name.length > 0) {
      this.randomizedService._names.push(name);
      this.randomizedService.setItemsToCache();
      this.value = "";
    }
  }
}

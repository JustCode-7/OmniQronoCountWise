import {Component} from '@angular/core';
import {UserInputComponent} from "../user-input/user-input.component";
import {DragAndDropComponent} from "../drag-and-drop/drag-and-drop.component";
import {OutputListComponent} from "../output-list/output-list.component";

@Component({
  selector: 'app-randomize-main',
  templateUrl: './randomize-main.component.html',
  standalone: true,
  imports: [
    UserInputComponent,
    DragAndDropComponent,
    OutputListComponent
  ]
})
export class RandomizeMainComponent {
}

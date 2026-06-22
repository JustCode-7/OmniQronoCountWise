import {Component, HostListener} from '@angular/core';
import {ImportDialogTemplateComponent} from '../../dialog-templates/import-dialog-template.component';
import {RandomServiceService} from '../../services/random-service.service';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    NgStyle,
    MatDialogModule
  ]
})
export class DragAndDropComponent {
  names: string[] = [];
  randomizedService: RandomServiceService;
  fileReader: FileReader;
  dialog: any;
  dragAndDropColor: string = "orange";
  protected readonly visualViewport = visualViewport;

  constructor(randomizedService: RandomServiceService,
              dialog: MatDialog) {
    this.randomizedService = randomizedService;
    this.fileReader = new FileReader();
    this.dialog = dialog;
  }

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    // Dragover listener --> maybe color-change or something like this
    this.dragAndDropColor = "green";
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    // Dragover listener --> maybe color-change or something like this
    this.dragAndDropColor = "orange";
  }

  @HostListener('drop', ['$event'])
  public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.dataTransfer?.files) {
      this.readFileInput(evt.dataTransfer.files);
    }
  }

  openExplorerForfileImport(file: HTMLInputElement) {
    file.click();
    file.onchange = () => {
      const selectedFile = file.files;
      this.readFileInput(selectedFile);
    }
  }

  private readFileInput(files: any) {
    if (files.length > 0) {
      const matDialogRef = this.dialog.open(ImportDialogTemplateComponent);
      let file = files[0];
      this.fileReader.readAsText(file);
      this.fileReader.onload = () => {
        matDialogRef.afterClosed().subscribe(() => {
          this.names = this.getFileContentAsStringArray(this.randomizedService._style)!;
          this.notifyService();
        });

      };

    }
  }

  private notifyService() {
    this.randomizedService.clearNames();
    this.randomizedService._names.push(...this.names);
    this.randomizedService.setItemsToCache();
  }

  private getFileContentAsStringArray(style: string) {
    let arr;
    if (style == "line") {
      arr = this.fileReader.result?.valueOf().toString().split(/\r?\n|\r/g)!;
    }
    if (style == "csv") {
      arr = this.fileReader.result?.valueOf().toString().split(",")!;
    }
    if (style == "wild") {
      arr = this.fileReader.result?.valueOf().toString().split(/[\s,]+/)!;
    }
    return arr;
  }
}

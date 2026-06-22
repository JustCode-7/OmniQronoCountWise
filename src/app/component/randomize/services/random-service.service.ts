import {Injectable} from '@angular/core';
import {RandomizedNameDialogComponent} from '../dialog-templates/randomized-name-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class RandomServiceService {

  _picks: number = 1
  _randomizedNames: string [] = [];
  _names: string[] = ["Jack", "Jill", "Jane"];
  jsonKey = "names";
  dialogConfig = new MatDialogConfig();
  _style: string = '';

  constructor(
    private dialog: MatDialog) {
    this.dialogConfig.position = {
      top: '15%'
    };
  }

  clearNames() {
    this._names = [];
  }

  getParsedJSON() {
    return JSON.parse(this.localStorageGetItemByKey()!);
  }

  public setItemsToCache() {
    localStorage.setItem(this.jsonKey, JSON.stringify(this._names));
  }

  public getItemFromCache() {
    return this.localStorageGetItemByKey();
  }

  public removeItem(key: string) {
    localStorage.removeItem(key);
  }

  public clearCache() {
    localStorage.clear();
  }

  reloadFromCache() {
    if (this.getParsedJSON() != null) {
      this._names = [];
      this._names.push(...this.getParsedJSON());
    }
  }

  removeName(name: string) {
    if (name.length > 0) {
      const indexToRemove = this._names.indexOf(name, 0);
      if (indexToRemove > -1) {
        this._names.splice(indexToRemove, 1);
      }
    }
  }

  randomize() {
    if (this._picks > 0 && this._names.length >= this._picks) {
      let shuffleRounds = this._picks;
      this._randomizedNames = [];
      this.getRandomizedNames(this._randomizedNames, shuffleRounds);
      this.dialog.open(RandomizedNameDialogComponent, this.dialogConfig);
    }
  }

  getRandomizedNames(names: string[], shuffleRounds: number): any {
    if (shuffleRounds >= 1) {
      let shuffle = Math.floor(Math.random() * (this._names.length));
      const randomName = this._names[shuffle];
      if (!names.includes(randomName)) {
        names.push(randomName);
        shuffleRounds -= 1;
      }
      return this.getRandomizedNames(names, shuffleRounds);
    }
  }

  setImportStyle(style: any) {
    if (style == "line") {
      this._style = "line";
    }
    if (style == "csv") {
      this._style = "csv";
    }
    if (style == "wild") {
      this._style = "wild";
    }
  }

  getListLengthAsValues() {
    let valueList = [];
    for (let i = 0; i < this._names.length; i++) {
      valueList.push(i + 1);
    }
    return valueList;
  }

  private localStorageGetItemByKey() {
    return localStorage.getItem(this.jsonKey);
  }
}

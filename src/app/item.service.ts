import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap } from 'rxjs/operator/mergeMap';
import {AngularIndexedDB} from 'angular2-indexeddb';
import { Item } from './item';
import { ITEMS } from './mock-items';
import { EventEmitter } from '@angular/core';

@Injectable()
export class ItemService {
  db: AngularIndexedDB;
  readonly dbName: string = 'CacheitDb';
  readonly storeName: string = 'item';
  readonly storeOptions: object = { keyPath: 'id', autoIncrement: true };
  private readonly _added: EventEmitter<Item> = new EventEmitter();

  private _openDb(): Observable<AngularIndexedDB> {
    console.log(`Open ${this.dbName}...`);
    return fromPromise(this.db.openDatabase(1, (evt) => {
        evt.currentTarget.result.createObjectStore(this.storeName,  this.storeOptions);
    }));
  }

  constructor() {
    this.db = new AngularIndexedDB(this.dbName, 1);
  }

  get added(): Observable<Item> {
    return this._added.asObservable();
  }

  getAll(): Observable<Item[]> {
    const open$ =  this._openDb();
    return mergeMap.call(open$, () => {
      return fromPromise(this.db.getAll(this.storeName));
    });
  }

  add(item: Item): void {
    this.db.add(this.storeName, item).then((evt) => {
      evt.value.id = evt.key;
      this._added.emit(evt.value);
    }, (error) => {
        console.log(error);
    });
  }

}

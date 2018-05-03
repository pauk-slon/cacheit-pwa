import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  items: Item[];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
    this.itemService.added.subscribe(item => this.items.push(item));
    this.itemService.deleted.subscribe(item => {
      this.items = this.items.filter(element => element.id !== item.id);
    });
  }

  getItems(): void {
    this.itemService.getAll()
        .subscribe(items => this.items = items);
  }

  addItem(file: File): void {
    Item.loadFromFile(file).subscribe(item => this.itemService.add(item));
  }

  deleteItem(item: Item) {
    this.itemService.delete(item);
  }
}

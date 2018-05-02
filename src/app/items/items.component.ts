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
  }

  getItems(): void {
    this.itemService.getAll()
        .subscribe(items => this.items = items);
  }

  addItem(): void {
    const newItem = {
      name: Math.random().toString(36).substring(2, 12),
    };
    this.itemService.add(newItem);
  }
}

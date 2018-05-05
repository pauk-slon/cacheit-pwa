import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ItemService } from '../item.service';
import { ItemTableDataSource } from './item-table.datasource';
import { MatDialog } from '@angular/material';
import { ItemViewComponent } from '../item-view/item-view.component';
import { Item } from '../item';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css']
})
export class ItemTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ItemTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['actions', 'name', 'type', 'size'];

  constructor(public itemView: MatDialog, private itemService: ItemService) {}

  ngOnInit() {
    this.dataSource = new ItemTableDataSource(this.paginator, this.sort, this.itemService);
  }

  addItem(file: File): void {
    Item.loadFromFile(file).subscribe(item => this.itemService.add(item));
  }

  viewItem(item: Item) {
    this.itemView.open(ItemViewComponent, {
      data: item,
      panelClass: 'item-view-dialog-overlay',
    });
  }

  deleteItem(item: Item) {
    this.itemService.delete(item);
  }
}

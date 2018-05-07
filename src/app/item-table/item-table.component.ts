import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
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

  private readonly GENERAL_COLUMNS = ['name', 'type', 'size', 'actions'];
  private readonly HANDSET_COLUMNS = ['name', 'actions'];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = this.GENERAL_COLUMNS;

  readonly isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(
    public itemView: MatDialog,
    private itemService: ItemService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset.subscribe(result => {
      this.displayedColumns = result.matches ? this.HANDSET_COLUMNS : this.GENERAL_COLUMNS;
    });
  }

  ngOnInit() {
    this.dataSource = new ItemTableDataSource(this.paginator, this.sort, this.itemService);
  }

  addItem(file: File): void {
    Item.loadFromFile(file).subscribe(item => this.itemService.add(item));
  }

  openItem(item: Item) {
    window.open(item.url, '_blank');
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

import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, Subject } from 'rxjs';
import { Item } from '../item';
import { ItemService } from '../item.service';

/**
 * Data source for the ItemTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ItemTableDataSource extends DataSource<Item> {
  data: Item[] = [];
  private readonly data$: Subject<Item[]> = new Subject<Item[]>();

  constructor(private paginator: MatPaginator, private sort: MatSort, private itemService: ItemService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Item[]> {
    this.itemService.getAll().subscribe(items => {
      this.data = items;
      this.data$.next(this.data);
    });
    this.itemService.added.subscribe(item => {
      this.data.push(item);
      this.data$.next(this.data);
    });
    this.itemService.deleted.subscribe(item => {
      this.data = this.data.filter(element => element.id !== item.id);
      this.data$.next(this.data);
    });
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.data$,
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
    this.data$.complete();
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Item[]) {
    this.paginator.length = this.data.length;
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Item[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'id':
        case 'size': return compare(+a[this.sort.active], +b[this.sort.active], isAsc);
        default: return compare(a[this.sort.active], b.name[this.sort.active], isAsc);
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

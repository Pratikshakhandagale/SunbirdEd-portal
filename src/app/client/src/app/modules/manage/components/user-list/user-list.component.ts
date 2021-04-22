import { Component, OnInit } from '@angular/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService, IPagination,
  ResourceService, ILoaderMessage, INoResultMessage, IContents, NavigationHelperService
} from '@sunbird/shared';

import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, map, mergeMap, first, tap, debounceTime, catchError, delay } from 'rxjs/operators';
import { combineLatest, Subject, of } from 'rxjs';

import { SimpleChanges } from '@angular/core';
import { SearchService, UserService, PermissionService } from '@sunbird/core';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public queryParams: any;
  public unsubscribe$ = new Subject<void>();
  showLoader = false;

  items = [];
  pageOfItems: Array<any>;

  initialPage = 1;
  pageSize = 10;
  maxPages = 5;

  pager: any = {};


  totalCount: number;

  constructor(private router: Router, private paginationService: PaginationService,
    private searchService: SearchService
    ) {
      this.searchService = searchService;

  }

  ngOnInit() {

     const searchParams = {
      filters: {
        'userType': 'student'
      }
    }

    this.searchService.userSearch(searchParams).subscribe(
      (apiResponse: ServerResponse) => {
        console.log({apiResponse})
      
    },
     err => {
      console.log({err})

    });

    this.items = Array(150).fill(0).map((x, i) => ({
      id: (i + 1), name: `Alice Oliver ${i + 1}`,
      "username": `Alice ${i + 1}`,
      "email": "alice_over@gamil.com",
      "userType": "Teacher",
      "registrationDate": "2021-11-28 07:02:36"
    }));
    if (this.items && this.items.length) {
      this.setPage(this.initialPage);
    }


  }


  editUser(item) {
    console.log({ item });
    this.router.navigate(['/user-form'], { queryParams: { item: item } });
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset page if items array has changed
    if (changes.items.currentValue !== changes.items.previousValue) {
      this.setPage(this.initialPage);
    }
  }

  private setPage(page: number) {
    alert(page);
    // get new pager object for specified page
    this.pager = this.paginationService.getPager(this.items.length, page, this.pageSize, this.maxPages);
    console.log('pager = ', this.pager)
    // get new page of items from items array
    var pageOfItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);

    // call change page function in parent component
    this.pageOfItems = pageOfItems;
  }

}

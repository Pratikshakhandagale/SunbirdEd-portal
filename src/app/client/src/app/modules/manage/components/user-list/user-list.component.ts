import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PaginationService } from '@sunbird/shared';

import { Router, ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';

import { SimpleChanges } from '@angular/core';
import { LearnerService, UserService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { debounceTime, distinctUntilChanged, delay, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public queryParams: any;
  public unsubscribe$ = new Subject<void>();
  @Output() userData: EventEmitter<any> = new EventEmitter();
  modelChanged: Subject<string> = new Subject<string>();

  showLoader = false;
  items = [];
  pageOfItems: Array<any>;
  initialPage = 1;
  pageSize = 10;
  maxPages = 5;

  pager: any = {};
  isOpen: boolean = false;

  totalCount: number;
  editItem: any;

  queryString: string = 'a';
  query: string;
  message: string;

  constructor(
    private router: Router,
    private paginationService: PaginationService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.userSearch(this.queryString);
    const userId = this.userService.userid;
    this.userService.updateUser().subscribe((res) => {
      console.log({ res });
    })
  }

  userSearch(query) {
    query = (this.query) ? this.query : this.queryString;
    const option = {
      data: {
        'request': {
          'filters': {
            'firstName': query
          }
        }
      }
    };

    this.userService.userSearch(option).subscribe((res) => {
      console.log(res.result.response.content);
      if (res.result.response.content) {
        this.items = res.result.response.content;
      }

      if (this.items && res.result.response.count) {
        this.setPage(this.initialPage);
      } else {
        this.message = "User Not Found"
        this.pageOfItems = [];
      }
    })

  }

  searchString() {
    this.userSearch(this.query);
  }

  clearString() {
    this.query = '';
    this.userSearch(this.query);
  }

  editUser(item) {
    this.editItem = item;
    this.isOpen = !this.isOpen;
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
    // get new pager object for specified page
    this.pager = this.paginationService.getPager(this.items.length, page, this.pageSize, this.maxPages);
    console.log('pager = ', this.pager)
    // get new page of items from items array
    var pageOfItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);

    // call change page function in parent component
    this.pageOfItems = pageOfItems;
  }


}

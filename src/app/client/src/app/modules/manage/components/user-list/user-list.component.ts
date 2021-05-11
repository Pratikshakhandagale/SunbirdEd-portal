import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PaginationService } from '@sunbird/shared';

import { Router, ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';

import { SimpleChanges } from '@angular/core';
import { SearchService, LearnerService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { map, catchError } from 'rxjs/operators';

import { UserManageService } from '../../services/user/user.service';
import { UserService } from '../../../../../../src/app/modules/core/services/user/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public queryParams: any;
  public unsubscribe$ = new Subject<void>();
  @Output() userData: EventEmitter<any> = new EventEmitter();

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

  constructor(
    private router: Router,
    private paginationService: PaginationService,
    private searchService: SearchService,
    private userManageService: UserManageService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public userService: UserService
  ) {
    this.searchService = searchService;
  }

  ngOnInit() {

    const userId = [this.userService.userid] ;

    const option = {
      url: this.config.urlConFig.URLS.USER.UPDATE_USER_PROFILE,
      data: {
        'request': {
          "userId": userId,
          "phone": 8888888888,
          "phoneVerified": true
        }
      }
    };

    return this.learnerService.patch(option).pipe(map(
      (res: ServerResponse) => {
        console.log('apiResponse -> ', res);

        return res;
      }
    ));


/*  const userId = [this.userService.userid] ;
  const option = {
    url: this.config.urlConFig.URLS.COURSE.GET_QR_CODE_FILE,
    data: {
      'request': {
        'filter': {
          'userIds': userId
        }
      }
    }
  };
    console.log('option -> ', option);


  return this.learnerService.post(option).pipe(
    map((apiResponse: ServerResponse) => {
      console.log('apiResponse -> ', apiResponse);

      return apiResponse;
    }),
    catchError((err) => {
      console.log('err -> ', err);

      return of(err);
    }));

    */
}


  // const option = {
  //   url: this.config.urlConFig.URLS.USER.SEARCH_USER,
  //   data: {
  //     'request': {
  //       'filters': {
  //         'firstName': 'a'
  //       }
  //     }
  //   }
  // };

//     this.learnerService.post(option).pipe(
//       map(res => {
//         console.log({ res });
// alert(' #### 1');
//         return res;
//       }), catchError(err => of('User type API error')));


  // let url = `${this.config.urlConFig.URLS.USER.SEARCH_USER}`;
  // //url = url + '?sortBy=createdDate&order=desc';
  // const options = {
  //   url: url
  // };

  // this.learnerService.get(options).subscribe((res: ServerResponse) => {
  //   console.log({res});
  //   alert('hihi');    //   console.log({res});
  //   alert('hihi');
  //   return res;

  // this.userManageService.getUserList().subscribe((res) => {
  //   this.items = res.data;
  //   console.log({ res });

  //   if (this.items && this.items.length) {
  //     this.setPage(this.initialPage);
  //   }
//  })
// }

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

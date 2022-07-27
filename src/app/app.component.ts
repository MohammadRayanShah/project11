import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StackExchangeService } from './services/stack-exchange.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { Orders } from './constants/order';
import { Sorts } from './constants/sorts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  orders: any = Orders
  sorts: any = Sorts
  items = [];
  data: boolean = true
  pageOfItems: Array<any> = [];
  displayedColumns: string[] = ['title'];
  dataSource = new MatTableDataSource<any>(this.pageOfItems);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public stackExchange: StackExchangeService,
    public fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator
    this.form = this.fb.group({
      page: [''],
      pagesize: [''],
      fromdate: [''],
      todate: [''],
      order: [''],
      sort: [''],
      tagged: [''],
      nottagged: [''],
      intitle: [''],
      site: ['stackoverflow']
    });
  }

  onSearch() {
    let unixTimestampFrom;
    if (this.form.controls['fromdate'].value) {
      let dateFrom = new Date(this.form.controls['fromdate'].value)
      unixTimestampFrom = Math.floor(dateFrom.getTime() / 1000);
      console.log(unixTimestampFrom);
    }
    let unixTimestampTo
    if (this.form.controls['todate'].value) {
      let dateTo = new Date(this.form.controls['todate'].value)
      unixTimestampTo = Math.floor(dateTo.getTime() / 1000);
      console.log(unixTimestampTo);
    }

    this.stackExchange.getAllQuestions(this.form.value, unixTimestampFrom, unixTimestampTo).subscribe((res) => {
      this.pageOfItems = res.items
      this.dataSource = new MatTableDataSource<any>(this.pageOfItems);
      this.dataSource.paginator = this.paginator;
      if (this.pageOfItems.length == 0) this.data = false
      else this.data = true
    });

  }
}

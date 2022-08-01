import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Orders } from 'src/app/constants/order';
import { Sorts } from 'src/app/constants/sorts';
import { Question } from 'src/app/interfaces/question';
import { StackExchangeService } from 'src/app/services/stack-exchange.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  orders: any = Orders;
  sorts: any = Sorts;
  data: boolean = true;
  pageOfItems: Array<Question> = [];
  displayedColumns: string[] = ['title'];
  question!: Question;
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
    this.dataSource.paginator = this.paginator;
    this.form = this.fb.group({
      page: [''],
      pagesize: [''],
      fromdate: [''],
      todate: [''],
      order: ['desc'],
      sort: ['votes'],
      tagged: [''],
      nottagged: [''],
      intitle: [''],
      site: ['stackoverflow'],
    });
  }

  onSearch() {
    let unixTimestampFrom;
    if (this.form.controls['fromdate'].value) {
      let dateFrom = new Date(this.form.controls['fromdate'].value);
      unixTimestampFrom = Math.floor(dateFrom.getTime() / 1000);
      console.log(unixTimestampFrom);
    }
    let unixTimestampTo;
    if (this.form.controls['todate'].value) {
      let dateTo = new Date(this.form.controls['todate'].value);
      unixTimestampTo = Math.floor(dateTo.getTime() / 1000);
      console.log(unixTimestampTo);
    }

    this.stackExchange
      .getAllQuestions(this.form.value, unixTimestampFrom, unixTimestampTo)
      .subscribe((res) => {
        this.pageOfItems = res.items;
        this.dataSource = new MatTableDataSource<Question>(this.pageOfItems);
        this.dataSource.paginator = this.paginator;
        if (this.pageOfItems.length == 0) this.data = false;
        else this.data = true;
      });
  }

  tagCLick(tag: string) {
    console.log('tag', tag);
    this.form.controls['intitle'].setValue(tag);
    this.onSearch();
  }
}

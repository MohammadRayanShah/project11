import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
  unixTimestampFrom!: number
  unixTimestampTo!: number
  dataSource = new MatTableDataSource<any>(this.pageOfItems);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public stackExchange: StackExchangeService,
    public fb: FormBuilder,
    public router: Router,
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
    this.unixTimestampFrom;
    if (this.form.controls['fromdate'].value) {
      let dateFrom = new Date(this.form.controls['fromdate'].value);
      this.unixTimestampFrom = Math.floor(dateFrom.getTime() / 1000);
    }
    this.unixTimestampTo;
    if (this.form.controls['todate'].value) {
      let dateTo = new Date(this.form.controls['todate'].value);
      this.unixTimestampTo = Math.floor(dateTo.getTime() / 1000);
    }
    let params = this.getParams(this.form.value, this.unixTimestampFrom, this.unixTimestampTo);
    this.stackExchange
      .getAllQuestions(params)
      .subscribe((res) => {
        this.pageOfItems = res.items;
        this.dataSource = new MatTableDataSource<Question>(this.pageOfItems);
        this.dataSource.paginator = this.paginator;
        if (this.pageOfItems.length == 0) this.data = false;
        else this.data = true;
      });
  }

  tagCLick(tag: string) {
    this.form.controls['intitle'].setValue(tag);
    this.onSearch();
  }

  getParams(data: any, unixTimestampFrom: any, unixTimestampTo: any, link = 'Nolink') {
    let newObj: any;
    newObj = {
      page: data.page || '',
      pagesize: data.pagesize || '',
      fromdate: unixTimestampFrom || '',
      todate: unixTimestampTo || '',
      order: data.order || '',
      sort: data.sort || '',
      tagged: data.tagged || '',
      nottagged: data.nottagged || '',
      intitle: data.intitle || '',
      site: data.site,
    };

    Object.keys(newObj).forEach((key) => {
      if (newObj[key] === '') delete newObj[key];
    });

    if (link === 'Nolink') {
      let params = new HttpParams({ fromObject: { ...newObj } });
      return params
    }
    else {
      return newObj
    }
  }

  linkClick(element: Question) {
    let params = this.getParams(this.form.value, this.unixTimestampFrom, this.unixTimestampTo, 'link');
    this.router.navigate(['/details/' + element.question_id], { queryParams: { ...params } });
  }
}

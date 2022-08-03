import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/interfaces/question';
import { StackExchangeService } from 'src/app/services/stack-exchange.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  params!: HttpParams;
  questionId!: number;
  questionData!: Question;
  creationDate!: number
  modifiedDate!: number
  data: boolean = true;
  pageOfItems: Array<Question> = [];
  displayedColumns: string[] = ['title'];

  dataSource = new MatTableDataSource<any>(this.pageOfItems);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public stackExchangeService: StackExchangeService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      this.params = new HttpParams({ fromObject: { ...res } });
    });

    this.route.params.subscribe((res) => {
      this.questionId = res['questionId'];
    });

    this.getQuestion();
    this.getAnswers();
  }

  getQuestion() {
    this.stackExchangeService
      .getQuestion(this.questionId, this.params)
      .subscribe((res) => {
        this.questionData = res.items[0];
        this.creationDate = this.questionData.creation_date
        this.modifiedDate = this.questionData.last_edit_date;
      });
  }

  getAnswers() {
    this.stackExchangeService.getAnswers(this.questionId, this.params).subscribe((res) => {
      console.log('res answers', res);
      this.pageOfItems = res.items;
      this.dataSource = new MatTableDataSource<Question>(this.pageOfItems);
      this.dataSource.paginator = this.paginator;
      if (this.pageOfItems.length == 0) this.data = false;
      else this.data = true;

    })
  }
}

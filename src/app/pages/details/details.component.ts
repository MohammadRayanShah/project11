import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  constructor(
    public stackExchangeService: StackExchangeService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      this.params = new HttpParams({ fromObject: { ...res } });
    });

    this.route.params.subscribe((res) => {
      this.questionId = res['questionId'];
    });

    this.getQuestion();
  }

  getQuestion() {
    this.stackExchangeService
      .getQuestion(this.questionId, this.params)
      .subscribe((res) => {
        this.questionData = res.items[0];
      });
  }
}

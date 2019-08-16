import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {User} from "../../model/model.user";
import {Question} from "../../model/model.Question";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {FieldService} from "../../services/field.service";
import {OverlayContainer} from "@angular/cdk/overlay";
import {Answer} from "../../model/model.Answer";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnswerComponent implements OnInit {

  constructor(public fieldService:FieldService,overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('unicorn-dark-theme');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentUser: User;
  errorMessage:any;
  isSrvButtonClicked:boolean;
  selectedQuestion:Question;
  dataSource = new MatTableDataSource<Question>();

  answer:Answer;
  answers:Answer[];

  question:Question;
  questions:Question[];
  displayedColumns:string[];
  clickedSrv:boolean = true;
  str:any;

  ngOnInit() {
    this.findAllAnswers();
    this.findAllQuestions();
    // for (var i = 0, len = q.length; i < len; i++) {
    //   someFn(arr[i]);
    // }
  }


  findAllAnswers(){
    this.fieldService.findAllAnswers(this.currentUser.id).subscribe(data=>{
      this.answers=data;
      this.dataSource.data=data;
      this.dataSource.paginator = this.paginator;

      console.log(data);
    },error => {
      console.log(error);
      this.errorMessage = "Can`t get Response List or empty";
    })
  }

  findAllQuestions(){
    this.fieldService.findAllQuestions(this.currentUser.id).subscribe(data=>{
      this.questions=data;
      console.log(data);
    },error => {
      console.log(error);
      this.errorMessage = "Can`t get Question List or empty";
    })
  }
}

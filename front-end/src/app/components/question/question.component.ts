import {Component, NgModule, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {User} from "../../model/model.user";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {Question} from "../../model/model.Question";
import {FieldService} from "../../services/field.service";
import {MatPaginator, MatTableDataSource, MatTableModule} from "@angular/material";
import { CdkTableModule } from "@angular/cdk/table";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AlterQuestionComponent} from "../alter-question/alter-question.component";
import {OverlayContainer} from "@angular/cdk/overlay";
import {AddQuestionComponent} from "../add-question/add-question.component";



@NgModule({
  imports: [
    CdkTableModule,
    MatTableModule,
  ]
})

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionComponent implements OnInit {

  currentUser: User;
  errorMessage:any;
  isSrvButtonClicked:boolean;
  selectedQuestion:Question;
  dataSource = new MatTableDataSource<Question>();
  question:Question;
  questions:Question[];
  displayedColumns = ['label', 'type', 'required','isActive','actions'];
  clickedSrv:boolean = true;
  isSelectedType: any;

  constructor(public dialog: MatDialog, public router: Router,public fieldService:FieldService,
              public accountService:AccountService,overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('unicorn-dark-theme');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;


  openEditRowDialog(j:number): void {
    this.question=this.questions[j];
    const dialogRef = this.dialog.open(AlterQuestionComponent, {
      data: {id:this.question.id,type:this.question.type, input:this.question.input, active:this.question.active,
          required:this.question.required,label:this.question.label},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.questions[j]=result;
      this.dataSource = new MatTableDataSource<Question>(this.questions);
      this.dataSource.paginator = this.paginator;
      this.putFieldList(j);

      console.log('The dialog was closed');
    });
  }



  ngOnInit() {
    this.isSrvButtonClicked=false;

    this.findAllQuestions();
    console.log(this.currentUser);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  putFieldList(id:number){
    this.fieldService.putFieldList(this.currentUser.id,this.questions[id]).subscribe(data=>{
      console.log(data);
    }, err=>{
      this.errorMessage=err;
    })
  }



  findAllQuestions(){
    this.fieldService.findAllQuestions(this.currentUser.id).subscribe(data=>{
      this.questions=data;
      this.dataSource.data=data;
      console.log("DATASOURCE: " + this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      console.log('paginator:');
      console.log(this.paginator);
      console.log(data);
      //this.addResponse();
    },error => {
       console.log(error);
      this.errorMessage = "Can`t get Question List or empty";
    })
  }

  hide(){
    this.clickedSrv=!this.clickedSrv;
  }
  deleteFieldList(j:number) {
    this.fieldService.deleteFieldList(this.questions[j].id).subscribe(data=>{
      console.log(data);
    }, err=>{
      this.errorMessage=err;
    })
  }

  deleteRow(j: number) {
    this.deleteFieldList(j);
    if (j > -1) {
      this.questions.splice(j, 1);
      this.dataSource = new MatTableDataSource<Question>(this.questions);
      this.dataSource.paginator = this.paginator;
      console.log(this.questions);
    }
  }
  AddRow() {
      this.findAllQuestions();
      this.dataSource = new MatTableDataSource<Question>(this.questions);
      this.dataSource.paginator = this.paginator;
      console.log(this.questions);

  }


  openAddQuestionDialog() {
    const AdddialogRef = this.dialog.open(AddQuestionComponent, {
      backdropClass: 'backdropBackground',
    });

    AdddialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.AddRow();
      console.log('The dialog was closed');
    });
  }
}

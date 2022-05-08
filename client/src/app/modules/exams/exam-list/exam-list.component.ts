import { Component, OnInit, ViewChild } from '@angular/core';
import { ExamService } from 'src/app/services/exam.service';
import { Exam } from 'src/app/common/exam';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { DialogService } from 'src/app/services/dialog.service';
import { NotificationServiceService } from 'src/app/services/notification-service.service';
import { CreateExamComponent } from '../create-exam/create-exam.component';
import { UpdateExamComponent } from '../update-exam/update-exam.component';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})

export class ExamListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  exams: Observable<Exam[]>;
  userIsAuthenticated = false;
  userRole='' ;
  displayedColumns: string[] = ['description','seats','course', 'begins','duration','actions'];
  public dataSource = new MatTableDataSource<Exam>()
  searchKey : String;

  constructor(
    private authService:AuthService,
    private examService: ExamService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private notificationService: NotificationServiceService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated)  this.userRole = this.authService.getAuthData().role;
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
      });
    };
  }

  formatToDate(date):string {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    return formatDate(date,format, locale)
  }
  loadData(){
    this.examService.getMyExamList()
    .subscribe(res => {
      this.dataSource.data = res['exams'] as Exam[];
    })
  }

  deleteExam(id) {
     this.examService.deleteExam(id)
      .subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error));
  }

  examDetails(id){
    this.router.navigate(['details', id]);
  }

  onSearchClear(){
    this.searchKey="";
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate(){
    this.router.navigate(["/exam/new"]);
    /*const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateExamComponent, dialogConfig).afterClosed().subscribe(()=>this.loadData());
    */
  }

  onEdit(id){
    this.examService.setSession('UserId', id);
    const dialogConfig= new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    this.dialog.open(UpdateExamComponent, dialogConfig).afterClosed().subscribe(
      res=>{
        this.loadData();
        this.notificationService.success('Updated Successfully');
       });
  }

  onDelete(id: string){
    this.dialogService.openConfirmDialog('Are you sure to delete this record?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.examService.deleteExam(id).subscribe(message=>{
          this.loadData();
          var msg = JSON.parse(message);
          this.notificationService.warn(msg.message);
        });
      }
    });
  }

  onRegister(id){
    this.dialogService.openConfirmDialog('Confirm exam registration?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.examService.deleteExam(id).subscribe(message=>{
          this.loadData();
          var msg = JSON.parse(message);
          this.notificationService.warn(msg.message);
        });
      }
    });
  }

  onDrop(id){
    this.dialogService.openConfirmDialog('Are you sure you want to drop exam?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.examService.deleteExam(id).subscribe(message=>{
          this.loadData();
          var msg = JSON.parse(message);
          this.notificationService.warn(msg.message);
        });
      }
    });
  }

}

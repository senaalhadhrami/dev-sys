import { Component, OnInit } from '@angular/core';
import { Exam } from 'src/app/common/exam';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/services/exam.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-exam',
  templateUrl: './update-exam.component.html',
  styleUrls: ['./update-exam.component.css']
})
export class UpdateExamComponent implements OnInit {

  id: string;
  exam: Exam;
  submitted = false;
  updating:boolean = false;


  constructor(private route: ActivatedRoute,private router: Router,
    private examService: ExamService,
    public dialogRef : MatDialogRef<UpdateExamComponent>) { }

  ngOnInit() {
    this.exam = new Exam();
    this.id= this.examService.getSession('UserId');
    this.examService.getExam(this.id)
      .subscribe(data => {
        this.exam = data.exam;
      }, error => console.log(error));
  }

  updateExam() {
    this.updating = true;
    this.examService.updateExam(this.id, this.exam)
      .subscribe(data => {
        console.log(data);
        this.onClose();
       }, error => console.log(error));
    this.exam = new Exam();
    this.gotoList();
  }

  onSubmit() {
    this.updateExam();
    this.submitted = true;
    //this.onClose();
  }

  onClose(){
    this.updating = false;
    this.dialogRef.close();
   }

  gotoList() {
    this.router.navigate(['/exams']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Exam } from 'src/app/common/exam';
import { ExamService } from 'src/app/services/exam.service';
import { Router } from '@angular/router';
import { MatDialogRef} from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/services/notification-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/common/course';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.css']
})
export class CreateExamComponent implements OnInit {

  exam: Exam = new Exam();
  courses: Course[] = [];
  submitted = false;
  registerForm: FormGroup;
  graterThanZero : boolean;
  creating:boolean = false;

  constructor(private examService: ExamService,
    private courseService:CourseService,
    private router: Router,
    //public dialogRef : MatDialogRef<CreateExamComponent>,
    private notificationService: NotificationServiceService,
    private formBuilder: FormBuilder) { }


  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          description: ['', Validators.required],
          seats: ['', [Validators.required, Validators.maxLength(2), Validators.minLength(1)]],
          course: ['', []],
          courseId: ['', []],
          begins: ['', Validators.required],
          duration: ['', Validators.required],
      });
      this.loadData();
  }

  loadData(){
    this.courseService.getMyCourseList()
    .subscribe(res => {
      this.courses = res['courses'] as Course[];
    })
  }

  newExam() : void{
    this.submitted = false;
  }

  onClear() {
    this.notificationService.success('Submitted successfully');
  }

  save(){
    this.creating = true;
    this.examService.createExam(this.exam)
      .subscribe(data => {
        this.notificationService.success('added successfully');
        this.onClose();
        this.gotolist();
        }, error => {this.notificationService.warn('Failed to add');
        this.onClose();
        this.gotolist();
      });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
        return;
    }
    this.submitted = true;
    this.save();
  }

  onClose(){
   this.creating = false;
   //this.dialogRef.close();
  }

  gotolist(){
    this.router.navigate(['/exams']);
  }
}

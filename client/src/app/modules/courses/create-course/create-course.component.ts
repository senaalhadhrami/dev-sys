import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/common/course';
import { CourseService } from 'src/app/services/course.service';
import { Router } from '@angular/router';
import { MatDialogRef} from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/services/notification-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Department } from 'src/app/common/department';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent implements OnInit {

  course: Course = new Course();
  departments: Department[] = [];
  submitted = false;
  registerForm: FormGroup;
  graterThanZero : boolean;
  creating:boolean = false;

  constructor(private courseService: CourseService, private departmentService:DepartmentService,
    private router: Router,
    //public dialogRef : MatDialogRef<CreateCourseComponent>,
    private notificationService: NotificationServiceService,
    private formBuilder: FormBuilder) { }


  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          code: ['', Validators.required],
          name: ['', Validators.required],
          credits: ['', Validators.required],
          seats: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1)]],
          department: [''],
          begins: ['', Validators.required],
      });
      this.loadData();
  }

  loadData(){
    this.departmentService.getDepartmentList()
    .subscribe(res => {
      this.departments = res['departments'] as Department[];
    })
  }

  newCourse() : void{
    this.submitted = false;
  }

  onClear() {
    this.notificationService.success('Submitted successfully');
  }

  save(){
    this.creating = true;
    this.courseService.createCourse(this.course)
      .subscribe(data => {
        this.notificationService.success('added successfully');
        this.onClose();
        this.gotolist();
        }, error => {this.notificationService.warn('Failed to add');this.onClose(); this.gotolist();});
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
  // this.dialogRef.close();
  }

  gotolist(){
    this.router.navigate(['/mycourses']);
  }
}

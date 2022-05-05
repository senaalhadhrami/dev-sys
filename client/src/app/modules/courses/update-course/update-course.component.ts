import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/common/course';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.css']
})
export class UpdateCourseComponent implements OnInit {

  id: string;
  course: Course;
  submitted = false;
  updating:boolean = false;


  constructor(private route: ActivatedRoute,private router: Router,
    private courseService: CourseService,
    public dialogRef : MatDialogRef<UpdateCourseComponent>) { }

  ngOnInit() {
    this.course = new Course();
    this.id= this.courseService.getSession('UserId');
    this.courseService.getCourse(this.id)
      .subscribe(data => {
        console.log(data);
        this.course = data.course;
      }, error => console.log(error));
  }

  updateCourse() {
    this.updating = true;
    this.courseService.updateCourse(this.id, this.course)
      .subscribe(data => {
        console.log(data);
        this.onClose();
       }, error => console.log(error));
    this.course = new Course();
    this.gotoList();
  }

  onSubmit() {
    this.updateCourse();
    this.submitted = true;
    //this.onClose();
  }

  onClose(){
    this.updating = false;
    this.dialogRef.close();
   }

  gotoList() {
    this.router.navigate(['/mycourses']);
  }
}

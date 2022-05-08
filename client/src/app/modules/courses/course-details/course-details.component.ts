import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/common/course';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {

  id: string;
  course: Course;

  constructor(private route: ActivatedRoute,private router: Router,
    private courseService: CourseService) { }

  ngOnInit() {
    this.course = new Course();

    this.id = this.route.snapshot.params['id'];

    this.courseService.getCourse(this.id)
      .subscribe(data => {
        console.log(data)
        this.course = data.course;
      }, error => console.log(error));
  }

  list(){
    this.router.navigate(['courses']);
  }

}

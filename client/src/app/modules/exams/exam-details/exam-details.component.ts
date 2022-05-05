import { Component, OnInit } from '@angular/core';
import { Exam } from 'src/app/common/exam';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/services/exam.service';

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent implements OnInit {

  id: string;
  exam: Exam;

  constructor(private route: ActivatedRoute,private router: Router,
    private examService: ExamService) { }

  ngOnInit() {
    this.exam = new Exam();

    this.id = this.route.snapshot.params['id'];

    this.examService.getExam(this.id)
      .subscribe(data => {
        console.log(data)
        this.exam = data.exam;
      }, error => console.log(error));
  }

  list(){
    this.router.navigate(['exams']);
  }

}

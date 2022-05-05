import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatConfirmDialogComponent } from 'src/app/modules/mat-confirm-dialog/mat-confirm-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { CourseListComponent } from 'src/app/modules/courses/course-list/course-list.component';
import { ProfileComponent } from 'src/app/modules/profile/profile.component';
import { UserListComponent } from 'src/app/modules/users/user-list/user-list.component';



@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent,
    ProfileComponent,
    CourseListComponent,
    UserListComponent,
    MatConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ]
})
export class DefaultModule { }

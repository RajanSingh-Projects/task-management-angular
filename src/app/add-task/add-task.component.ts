import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TaskService } from '../task.service';
import { AuthService } from '../auth.service';
import { Task } from '../task.model';
import { User } from '../user.model';
import { Team } from '../team.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  userList: User[];
  teams: Team[];
  statusList = [
    {id: 0, text: 'To Do'},
  ]

  constructor(private formBuilder: FormBuilder, private taskService: TaskService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.addTaskForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'team': ['', Validators.required],
      'assigned_to': ['', Validators.required],
      'description': [''],
      'status': ['', Validators.required],
      'deadline': ['', Validators.required],
    })

    this.authService.listUsers().subscribe((users:User[]) => {
      this.userList = users;
    });

    this.taskService.listTeams().subscribe((teams: Team[]) => {
      this.teams = teams;
    })

    this.addTaskForm.patchValue({
      'status': this.statusList[0].id
    });
  }

  onTeamSelect(teamId: number) {
    if (teamId) {
      this.userList = this.teams.filter(Team => Team.id==teamId)[0].members;
      this.addTaskForm.patchValue({
        'assigned_to': ''
      });
    }
  }

  onAddTaskSubmit() {
    let deadline = new Date(this.addTaskForm.value.deadline)
    this.addTaskForm.patchValue({
      'deadline': deadline.getFullYear() + '-' + deadline.getMonth() + '-' + deadline.getDate()
    })  ;
    console.log(this.addTaskForm.value);
    this.taskService.createTask(this.addTaskForm.value).subscribe();
    this.router.navigate(['admin']);
  }

}



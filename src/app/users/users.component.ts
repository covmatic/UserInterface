import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { User, UserService } from '../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  columns = ['username', 'name', 'surname', 'role']
  .map(key => ({columnDef: key, header: key, cell: (element: any) => `${element[key]}`, total: 0}));
  contextMenuPosition = { x: '0px', y: '0px' };

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;


  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.userService.getUsers().subscribe(users => {
      if (users.length > 0) {
        this.dataSource.data = users;
      } else {
        this.addUser();
      }
    });
  }

  onContextMenu(event) {
    this.contextMenuPosition.x = event.x + 'px';
    this.contextMenuPosition.y = event.y + 'px';
    this.contextMenu.menuData = { item: event.row };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  addUser(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(UserDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      user => {
        if (user) {
          this.userService.addUser(user).subscribe(() =>
          this.userService.getUsers().subscribe(users => {
            this.dataSource.data = users;
          }));
        }
      }
    );
  }

  deleteUser(item: User){
    this.userService.deleteUser(item.username).subscribe(() =>
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
    }));
  }

}

@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog.html',
  styleUrls: ['./users.component.css']

})
export class UserDialogComponent implements OnInit {
  profileForm = new FormGroup({
    username: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  roles: string[];

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService
    ) {}

  ngOnInit() {
    this.userService.getRoles().subscribe(roles => this.roles = roles);

  }

  save(): void {
    this.dialogRef.close(this.profileForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}

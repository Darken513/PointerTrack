import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  @Input() users: any[] = [];
  @Input() action: string = '';
  @Output() onEvent = new EventEmitter<any>();
  public sendMsg(event: any) {
    this.onEvent.emit(event)
  }
}

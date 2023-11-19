import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-actions-list',
  templateUrl: './actions-list.component.html',
  styleUrls: ['./actions-list.component.scss']
})
export class ActionsListComponent {
  @Output() onEvent = new EventEmitter<any>();
  public sendMsg(event:any){
    this.onEvent.emit(event)
  }
}

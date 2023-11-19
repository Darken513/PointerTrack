import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent {
  @Output() onEvent = new EventEmitter<any>();
  @Input() restaurants: any[] = [];

  public sendMsg(event:any){
    this.onEvent.emit(event)
  }
}

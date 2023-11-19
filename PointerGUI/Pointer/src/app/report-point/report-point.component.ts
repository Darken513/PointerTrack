import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-report-point',
  templateUrl: './report-point.component.html',
  styleUrls: ['./report-point.component.scss']
})
export class ReportPointComponent {
  @Input() data: any;
  @Output() onEvent = new EventEmitter<any>();
  public sendMsg(){
    this.onEvent.emit(true)
  }
}

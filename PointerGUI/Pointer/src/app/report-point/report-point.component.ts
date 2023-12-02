import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '../notification.service';
import { HttpServiceCustom } from '../users.service';

@Component({
  selector: 'app-report-point',
  templateUrl: './report-point.component.html',
  styleUrls: ['./report-point.component.scss']
})
export class ReportPointComponent {
  @Input() data: any;
  @Output() onEvent = new EventEmitter<any>();

  constructor(
    private notifService: NotificationService,
    private userService: HttpServiceCustom
  ) { }

  public sendMsg() {
    this.onEvent.emit(true)
  }
  public updateUsedVehicle(vehicle: any) {
    this.userService.updateUsedVehicle(this.data.docId, vehicle.id).subscribe((val) => {
      this.notifService.showNotification(val.title, val.body);
      this.sendMsg();
    })
  }
}

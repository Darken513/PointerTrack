import { Component } from '@angular/core';
import { NotificationService } from '../notification.service';
import { HttpServiceCustom } from '../users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  public userStep: number = 0;
  public selectedRestaurant: any;
  public selectedAction: any;
  public selectedUser: any;
  public selectedCode: any;
  public reportData: any;
  public restaurants:any[] = [];
  public users:any[] = [];
  constructor(
    private notifService: NotificationService,
    private userService: HttpServiceCustom
  ) {}

  ngOnInit(): void {
    this.userService.getAllRestaurants().subscribe((res) => {
      this.restaurants = res.restaurants;
    });
  }
  public goBackToPrevStep(){
    if(this.userStep){
      this.userStep -= 1;
    }
  }
  public onRestaurantEvent(event: any) {
    this.selectedRestaurant = event;
    this.userStep += 1;
  }
  public onActionEvent(event: any) {
    this.selectedAction = event;
    let serviceAction = this.selectedAction.checkkingIn
      ? this.userService.getAllUnPointed()
      : this.userService.getAllPointed();
    serviceAction.subscribe(
      (res) => {
        this.users = res.users;
      },
      (error) => {}
    );
    this.userStep += 1;
  }
  public onUserSelectionEvent(event: any) {
    this.selectedUser = event;
    this.userStep += 1;
  }
  public onCodeSelectionEvent(event: any) {
    this.selectedCode = event;
    let topost = {
      restaurant: this.selectedRestaurant,
      user: {
        id: this.selectedUser.id,
        name: this.selectedUser.name,
        code: this.selectedCode,
      },
      actionDone: this.selectedAction.checkkingIn ? 'Pointage' : 'Depointage',
      currentTime: new Date(),
    }
    this.userService.checkCodeAndSubmitAction(topost).subscribe({
      next: (val)=>{
        if(val.title == "error"){
          this.notifService.showNotification(val.title, val.body);
          return;
        }
        this.reportData = {
          restaurant: this.selectedRestaurant,
          user: this.selectedUser,
          actionDone: this.selectedAction.checkkingIn ? 'Pointage' : 'Depointage',
          currentTime: new Date(),
        };
        this.userStep += 1;
      },
      error: (error)=>{
        console.log(error);
      }
    })
  }
  public onReportEvent() {
    this.userStep = 0;
    this.selectedRestaurant = undefined;
    this.selectedAction = undefined;
    this.selectedUser = undefined;
    this.selectedCode = undefined;
    this.reportData = undefined;
  }
}

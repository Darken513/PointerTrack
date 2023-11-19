import { Component } from '@angular/core';
import { NotificationService } from '../notification.service';
import { HttpServiceCustom } from '../users.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public restaurants: any[] = [];
  public users: any[] = [];
  public newUser:any = {username:'', code:''};
  public newRestaurant:any = {name:''};
  public modalOn:boolean = false;
  public addingUser:boolean = false;
  public addingRestaurant:boolean = false;
  constructor(
    private notifService: NotificationService,
    private userService: HttpServiceCustom
  ) { }

  ngOnInit(): void {
    this.restaurants = [];
    this.users = [];
    this.userService.getAllRestaurants().subscribe((res) => {
      this.restaurants = res.restaurants;
    });
    this.userService.getAllUnPointed().subscribe(
      {
        next: (res) => {
          this.users.push(...res.users);
        }
      }
    );
    this.userService.getAllPointed().subscribe(
      {
        next: (res) => {
          this.users.push(...res.users);
        }
      }
    );
  }
  public addUser(){
    this.modalOn = true;
    this.addingUser = true;
  }
  public addRestaurant(){
    this.modalOn = true;
    this.addingRestaurant = true;
  }
  public closeModal(){
    this.modalOn = false;
    this.addingUser = false;
    this.addingRestaurant = false;
    this.newUser = {username:'', code:''};
    this.newRestaurant = {name:''};
  }
  public submitUserCreation(){
    this.userService.createNewUser(this.newUser).subscribe({
      next:(val)=>{
        this.notifService.showNotification('success', 'Utilisateur ajouté avec succès');
        this.closeModal();
        this.ngOnInit();
      }
    })
  }
  public submitRestaurantCreation(){
    this.userService.createNewRestaurant(this.newRestaurant).subscribe({
      next:(val)=>{
        this.notifService.showNotification('success', 'Restaurant ajouté avec succès');
        this.closeModal();
        this.ngOnInit();
      }
    })
  }
}

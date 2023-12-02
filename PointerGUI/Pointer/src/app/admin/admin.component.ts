import { Component } from '@angular/core';
import { NotificationService } from '../notification.service';
import { HttpServiceCustom } from '../users.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public isAdmin: boolean = false;
  public restaurants: any[] = [];
  public users: any[] = [];
  public newUser: any = { username: '', code: '' };
  public newRestaurant: any = { name: '' };
  public modalOn: boolean = false;
  public addingUser: boolean = false;
  public addingRestaurant: boolean = false;
  public removingUser: boolean = false;
  public userToDelete: any = undefined;
  public removingRestaurant: boolean = false;
  public restaurantToDelete: any = undefined;
  startDate: string = '';
  endDate: string = '';

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
    this.userService.getAllUsers().subscribe(
      {
        next: (res) => {
          this.users.push(...res.users);
        }
      }
    );
  }
  handleReportSubmit(toDownload: boolean): void {
    if (!this.startDate.length || !this.endDate.length) {
      this.notifService.showNotification('error', 'Please select valid dates');
      return;
    }
    const details = {
      startDate: this.startDate,
      endDate: this.endDate,
      toDownload
    }
    this.userService.getAllFromTo(details).subscribe((val) => {
      this.notifService.showNotification(val.title, val.body);
    })
  }
  public addUser() {
    this.modalOn = true;
    this.addingUser = true;
  }
  public addRestaurant() {
    this.modalOn = true;
    this.addingRestaurant = true;
  }
  public closeModal() {
    this.modalOn = false;
    this.addingUser = false;
    this.addingRestaurant = false;
    this.newUser = { username: '', code: '' };
    this.newRestaurant = { name: '' };
  }
  public submitUserCreation() {
    this.userService.createNewUser(this.newUser).subscribe({
      next: (val) => {
        this.notifService.showNotification('success', 'Utilisateur ajouté avec succès');
        this.closeModal();
        this.ngOnInit();
      }
    })
  }
  public deleteUser(user: any) {
    this.modalOn = true;
    this.userToDelete = user;
    this.removingUser = true;
  }
  public submitDeleteUser() {
    this.userService.deleteUserById(this.userToDelete.id).subscribe({
      next: (val) => {
        this.notifService.showNotification('success', 'Utilisateur supprimé avec succès');
        this.closeModal();
        this.ngOnInit();
      }
    })
  }
  public cancelDeleteUser() {
    this.modalOn = false;
    this.userToDelete = undefined;
    this.removingUser = false;
  }
  public submitRestaurantCreation() {
    this.userService.createNewRestaurant(this.newRestaurant).subscribe({
      next: (val) => {
        this.notifService.showNotification('success', 'Restaurant ajouté avec succès');
        this.cancelDeleteUser();
        this.ngOnInit();
      }
    })
  }
  public deleteRestaurant(restaurant: any) {
    this.modalOn = true;
    this.restaurantToDelete = restaurant;
    this.removingRestaurant = true;
  }
  public submitDeleteRestaurant() {
    this.userService.deleteRestaurantById(this.restaurantToDelete.id).subscribe({
      next: (val) => {
        this.notifService.showNotification('success', 'Restaurant supprimé avec succès');
        this.cancelDeleteRestaurant();
        this.ngOnInit();
      }
    })
  }
  public cancelDeleteRestaurant() {
    this.modalOn = false;
    this.restaurantToDelete = undefined;
    this.removingRestaurant = false;
  }
  public checkAdminCode(event: any) {
    if (event == "3087") {
      this.isAdmin = true;
    } else {
      this.notifService.showNotification('error', 'Mauvais code');
    }
  }
}

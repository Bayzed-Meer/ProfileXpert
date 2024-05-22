import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Profile } from '../../models/profile.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-show-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.scss',
})
export class ShowProfileComponent {
  @Input() userId!: string;
  userData!: Profile;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.getUserData(this.userId);
  }

  getUserData(userId: string) {
    this.userService
      .getSharedUserData(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((data) => {
          this.userData = data;
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          console.error(error);
          return of(error);
        })
      )
      .subscribe();
  }

  getUserProfilePictureUrl(): string {
    if (this.userData && this.userData.profilePicture) {
      return `http://localhost:3000/${this.userData.profilePicture}`;
      // return `https://profilexpert.onrender.com/${this.userData.profilePicture}`;
    }
    return '';
  }
}

import { Component, Input } from '@angular/core';
import { StatReviews, Stay } from 'src/app/models/stay.model';
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'stay-preview',
  templateUrl: './stay-preview.component.html',
  styleUrls: ['./stay-preview.component.scss']
})
export class StayPreviewComponent {
  @Input() stay!: Stay
  faStar = faStar
  isWishlisted = false

  constructor(private userService: UserService) {}

  getRateAvg() {
    let rate = 0
    let key: keyof StatReviews
    for (key in this.stay.statReviews) {
      rate += this.stay.statReviews[key]
    }
    return (rate / 6).toFixed(2)
  }

  isTopRated(): boolean {
    return +this.getRateAvg() >= 4.8 && this.stay.reviews?.length >= 5
  }

  isNewListing(): boolean {
    return !this.stay.reviews || this.stay.reviews.length === 0
  }

  onToggleWishlist(ev: Event) {
    ev.preventDefault()
    ev.stopPropagation()
    this.isWishlisted = !this.isWishlisted
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { StatReviews, Stay } from 'src/app/models/stay.model';
import { faStar, faCircleMinus, faCirclePlus, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Order } from 'src/app/models/order.model';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'stay-order',
  templateUrl: './stay-order.component.html',
  styleUrls: ['./stay-order.component.scss']
})

export class StayOrderComponent implements OnInit {
  constructor(private utilService: UtilService) { }

  @Input() stay !: Stay
  @Input() order !: Order
  @Output() addOrder = new EventEmitter()

  faCirclePlus = faCirclePlus
  faCircleMinus = faCircleMinus
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  faStar = faStar
  showGuestModal: boolean = false

  ngOnInit () {
    if (!this.order.startDate.getTime()) this.order.startDate = new Date()
    if (!this.order.endDate.getTime()) this.order.endDate = new Date(Date.now() + (3600 * 1000 * 72))
  }

  onAddOrder () {
    this.addOrder.emit()
  }

  public toggleGuestModal () {
    this.showGuestModal = !this.showGuestModal
  }

  onStartDateChange (ev: Event) {
    const val = (ev.target as HTMLInputElement).value
    if (val) this.order.startDate = new Date(val)
  }

  onEndDateChange (ev: Event) {
    const val = (ev.target as HTMLInputElement).value
    if (val) this.order.endDate = new Date(val)
  }

  get GetTotalDays (): number {
    return this.utilService.getDaysBetweenDates(this.order.endDate, this.order.startDate)
  }

  get Price () {
    return this.stay.price * this.GetTotalDays
  }

  get CleanTax () {
    return (this.Price * 0.10).toFixed()
  }

  get ServiceFee () {
    return (this.Price * 0.17).toFixed()
  }

  get TotalPrice () {
    return (+this.Price + +this.CleanTax + +this.ServiceFee)
  }

  get RateAvg () {
    let rate = 0
    let key: keyof StatReviews
    for (key in this.stay.statReviews) {
      rate += this.stay.statReviews[key]
    }
    return (rate / 6).toFixed(2)
  }

  getGuests () {
    let str = this.order.guests.adults + this.order.guests.children > 0 ? (this.order.guests.adults + this.order.guests.children) + ' guests ' : ''
    str += this.order.guests.infants > 0 ? ' ,' + this.order.guests.infants + ' infants ' : ''
    str += this.order.guests.pets > 0 ? ' ,' + this.order.guests.pets + ' pets ' : ''
    return str
  }

  toInputDate (date: Date): string {
    return date.toISOString().split('T')[0]
  }
}

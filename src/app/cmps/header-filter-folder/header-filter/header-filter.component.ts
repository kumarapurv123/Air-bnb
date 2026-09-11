import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { StayFilter } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'header-filter',
  templateUrl: './header-filter.component.html',
  styleUrls: ['./header-filter.component.scss']
})
export class HeaderFilterComponent implements OnInit, OnDestroy {
  @Input() isHeaderFilterActive!: boolean
  @Output() toggleHeaderFilter = new EventEmitter<void>()

  constructor(
    private orderService: OrderService,
    private stayService: StayService,
    private utilService: UtilService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  faMagnifyingGlass = faMagnifyingGlass
  modalNav = ''
  searchFilter = ''
  order !: Order
  subscriptionOrder!: Subscription
  subscriptionStayFilter!: Subscription
  isBlur: boolean = false
  stayFilter!: StayFilter

  ngOnInit() {
    this.subscriptionOrder = this.orderService.order$.subscribe(order => this.order = order)
    this.subscriptionStayFilter = this.stayService.stayFilter$.subscribe(stayFilter => this.stayFilter = stayFilter)
  }

  get Anywhere() {
    return this.stayFilter.place ? this.stayFilter.place : 'stay.header.anywhere'
  }

  get AnyWeek() {
    if (!this.order.startDate || !this.order.endDate) return 'stay.header.anyweek'
    if (this.order.startDate.getMonth() === this.order.endDate.getMonth()) {
      const monthName = this.utilService.getMonthName(this.order.endDate.getMilliseconds())
      return `${monthName} ${this.order.startDate.getDate()} - ${this.order.endDate.getDate()}`
    }
    const month1 = this.utilService.getMonthName(this.order.startDate.getMilliseconds())
    const month2 = this.utilService.getMonthName(this.order.endDate.getMilliseconds())
    return `${month1} ${this.order.startDate.getDate()} - ${month2} ${this.order.endDate.getDate()}`
  }

  get AddGuest() {
    const guests = this.order.guests
    if (guests.adults === 1 && guests.children === 0 && guests.infants === 0 && guests.pets === 0) return 'stay.header.add-guests'
    return this.getGuests()
  }

  onToggleHeaderFilter() {
    this.toggleHeaderFilter.emit()
  }

  setModalNav(val: string) {
    this.modalNav = val
  }

  onSetWhereSearch(val: string) {
    this.searchFilter = val
    if (val) this.setModalNav('search-place-modal')
    else this.setModalNav('region-modal')
  }

  onClickDate(val: string) {
    this.modalNav = val
  }

  onClickGuests(val: string) {
    this.setModalNav(val)
  }

  onClickSearch() {
    this.orderService.setOrder(this.order)
    this.stayService.setFilter(this.stayFilter)
    this.applyFilterToRoute(this.stayFilter)
    this.onToggleHeaderFilter()
  }

  onStartDateChange(ev: Event) {
    const val = (ev.target as HTMLInputElement).value
    if (val) this.order.startDate = new Date(val)
  }

  onEndDateChange(ev: Event) {
    const val = (ev.target as HTMLInputElement).value
    if (val) this.order.endDate = new Date(val)
  }

  toInputDate(date: Date): string {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  getGuests() {
    let str = this.order.guests.adults + this.order.guests.children > 0 ? (this.order.guests.adults + this.order.guests.children) + ' guests ' : ''
    str += this.order.guests.infants > 0 ? ' ,' + this.order.guests.infants + ' infants ' : ''
    str += this.order.guests.pets > 0 ? ' ,' + this.order.guests.pets + ' pets ' : ''
    return str
  }

  setSearchFilter(place: string) {
    this.searchFilter = place
  }

  private applyFilterToRoute(filter: StayFilter): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: filter,
        queryParamsHandling: 'merge'
      }
    )
  }

  ngOnDestroy() {
    this.subscriptionOrder.unsubscribe()
    this.subscriptionStayFilter.unsubscribe()
  }
}

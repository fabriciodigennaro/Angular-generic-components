import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  @Input() set totalRecords(value: number) {
    const addPage = value % this.perPage > 0 ? 1 : 0;
    const totalPages = Math.floor(value / this.perPage) + addPage;
    this.pages = Array.from(Array(totalPages).keys()).map((k) => k + 1);
    this.lastPage = this.pages.length;
    this.dynamicPagesInitialSet();
  }
  @Input() perPage: number = 5;
  @Output() changePage = new EventEmitter<number>();

  dynamicPages: number[] = [];
  dynamicPagesMaxLength: number = 3;
  defaultPage = 1;
  currentPage = this.defaultPage;
  pages: number[] = [];
  firstPage: number = 1;
  lastPage: number = this.pages.length;

  constructor() {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.dynamicPagesInitialSet();
    this.lastDynamicPagesSet();
    this.currentPage = this.defaultPage;
    this.changePage.emit(this.currentPage);
  }

  goToPage(page: number) {
    // Only emit on efective change page
    if (this.currentPage !== page) {
      this.currentPage = page || 1;
      this.changePage.emit(this.currentPage);
    }

    if (this.currentPage == this.firstPage) {
      this.dynamicPagesInitialSet();
    }
    if (this.currentPage == this.lastPage) {
      this.lastDynamicPagesSet();
    }
  }

  next() {
    if (this.currentPage < this.pages.length) {
      this.currentPage = this.currentPage + 1;
      this.changePage.emit(this.currentPage);
    }
    if (
      this.currentPage < this.lastPage &&
      this.currentPage > this.dynamicPages[this.dynamicPages.length - 1]
    ) {
      this.increaseDynamicPages();
    }
  }

  back() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.changePage.emit(this.currentPage);
    }
    if (
      this.currentPage > this.firstPage &&
      this.currentPage < this.dynamicPages[0]
    ) {
      this.decreaseDynamicPages();
    }
  }

  hideButtonPrev(): boolean {
    return this.currentPage == 1;
  }

  hideButtonNext(): boolean {
    return this.currentPage == this.pages.length;
  }

  showFirstPageDots() {
    return (
      this.dynamicPages.length &&
      !this.areConsecutives(this.firstPage, this.dynamicPages[0])
    );
  }

  showLastPageDots() {
    return (
      this.dynamicPages.length &&
      !this.areConsecutives(
        this.lastPage,
        this.dynamicPages[this.dynamicPages.length - 1]
      )
    );
  }

  areConsecutives(param1: number, param2: number) {
    return param1 + 1 == param2 || param2 + 1 == param1;
  }

  dynamicPagesInitialSet() {
    this.dynamicPages = [];
    for (
      let pageNumber = this.firstPage + 1;
      pageNumber < this.lastPage &&
      this.dynamicPages.length < this.dynamicPagesMaxLength;
      pageNumber++
    ) {
      this.dynamicPages.push(pageNumber);
    }
  }

  lastDynamicPagesSet() {
    this.dynamicPages = [];
    for (
      let pageNumber = this.lastPage - 1;
      pageNumber > this.firstPage &&
      this.dynamicPages.length < this.dynamicPagesMaxLength;
      pageNumber--
    ) {
      this.dynamicPages.unshift(pageNumber);
    }
  }

  increaseDynamicPages() {
    this.dynamicPages = this.dynamicPages.map((page) => page + 1);
  }

  decreaseDynamicPages() {
    this.dynamicPages = this.dynamicPages.map((page) => page - 1);
  }
}

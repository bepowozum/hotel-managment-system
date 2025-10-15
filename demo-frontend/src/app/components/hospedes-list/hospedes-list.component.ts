import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hospedes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hospedes-list.component.html',
  styleUrls: ['./hospedes-list.component.scss']
})
export class HospedesListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

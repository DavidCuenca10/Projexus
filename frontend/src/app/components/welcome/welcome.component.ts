import { Component, OnInit } from '@angular/core';
declare var AOS: any;

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit{
  ngOnInit(): void {
    AOS.init();
  }
}

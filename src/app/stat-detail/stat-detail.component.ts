import { Component, Input } from '@angular/core';
import { ServerRequestExecutionStat } from '../api/actuator/model/serverRequestExecutionStat';

@Component({
  selector: 'app-stat-detail',
  templateUrl: './stat-detail.component.html',
  styleUrls: ['./stat-detail.component.css'],
})
export class StatDetailComponent {
  @Input() stat!: ServerRequestExecutionStat;
}

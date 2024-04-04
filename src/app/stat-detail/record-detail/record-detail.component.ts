import { Component, Input } from '@angular/core';
import { StatisticRecord } from 'src/app/api/actuator/model/statisticRecord';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.css'],
})
export class RecordDetailComponent {
  @Input() title!: string;
  @Input() record!: StatisticRecord;
  @Input() uom?: string;
}

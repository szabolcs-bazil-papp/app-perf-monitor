import { Component } from '@angular/core';
import { ActuatorService } from './actuator.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ServerRequestExecutionStat } from './api/actuator/model/serverRequestExecutionStat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app-perf-monitor';

  target: string = '';
  running: boolean = false;
  private routine?: NodeJS.Timeout;

  private stats: ServerRequestExecutionStat[] = [];
  private statsChanged: Subject<void> = new Subject();
  private sub = this.statsChanged.subscribe(() => {
    if (this.stats.length === 0) {
      return;
    }

    const data: any[] = this.stats.map((it) => this.dataPoint(it));
    this.chartOptions = {
      theme: 'light2',
      title: { text: 'Actions' },
      subtitles: [{ text: 'Endpoints encountered' }],
      animationEnabled: true,
      axisY: {
        title: 'Time (ms)',
        suffix: 'ms',
      },
      data: [
        {
          type: 'rangeColumn',
          indexLabel: '{y[#index]} ms',
          toolTipContent: '<b>{label}</b><br>Min: {y[0]}<br>Avg: {y[2]}<br>Max: {y[1]}',
          dataPoints: data,
        },
      ],
    };
  });

  detail?: ServerRequestExecutionStat;

  chartOptions = {
    theme: 'light2',
    title: { text: 'Actions' },
    subtitles: [{ text: 'Endpoints encountered' }],
    animationEnabled: true,
    axisY: {
      title: 'Time (ms)',
      suffix: 'ms',
    },
    data: [
      {
        type: 'rangeColumn',
        indexLabel: '{y[#index]} ms',
        toolTipContent: '<b>{label}</b><br>Min: {y[0]}<br>Avg: {y[2]}',
        dataPoints: [] as any,
      },
    ],
  };

  constructor(private actuatorService: ActuatorService) {}

  async start(): Promise<void> {
    if (this.target.length === 0) {
      this.running = false;
    }
    this.running = !this.running;
    if (this.running) {
      if (this.routine) {
        clearInterval(this.routine);
        this.routine = undefined;
      }

      this.routine = setInterval(async () => {
        this.stats = await this.actuatorService.getStatus(this.target);
        this.stats.sort((a, b) => (b.fullStat?.max ?? 0) - (a.fullStat?.max ?? 0));
        this.statsChanged.next();
      }, 500);
    } else {
      if (this.routine) {
        clearInterval(this.routine);
        this.routine = undefined;
      }
    }
  }

  private dataPoint(stat: ServerRequestExecutionStat): any {
    return {
      label: `${stat.viewName} ${stat.actionCode}`,
      y: [stat.fullStat?.min ?? 0, stat.fullStat?.max ?? 0, stat.fullStat?.avg ?? 0],
      origin: stat,
      click: (e: any) => {
        this.detail = stat;
      },
    };
  }
}

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

    this.chartOptions = this.createChartOptions();
    if (!this.chartOptions) {
      this.detail = undefined;
    }
  });

  detail?: ServerRequestExecutionStat;

  chartOptions?: any;

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
        this.stats.sort((a, b) => (a.fullStat?.avg ?? 0) - (b.fullStat?.avg ?? 0));
        this.statsChanged.next();
      }, 500);
    } else {
      if (this.routine) {
        clearInterval(this.routine);
        this.routine = undefined;
      }
    }
  }

  private createChartOptions(): any | undefined {
    const rangeData: any[] = this.stats.map((it) => this.rangeDataPoint(it));
    const avgData: any[] = this.stats.map((it) => this.avgDataPoint(it));
    return {
      theme: 'light2',
      title: { text: 'Actions' },
      subtitles: [{ text: 'Endpoints encountered' }],
      animationEnabled: true,
      axisY: {
        title: 'Time (ms)',
        suffix: 'ms',
        includeZero: true,
      },
      toolTip: {
        shared: true,
      },
      data: [
        {
          type: 'error',
          indexLabel: '{y[#index]} ms',
          toolTipContent: '<b>{label}</b><br>Min: {y[0]}<br>Max: {y[1]}',
          dataPoints: rangeData,
        },
        {
          type: 'bar',
          name: 'Avg',
          toolTipContent: '{name}: {y}',
          dataPoints: avgData,
        },
      ],
    };
  }

  private rangeDataPoint(stat: ServerRequestExecutionStat): any {
    return {
      label: `${stat.viewName ?? 'GLOBAL'} ${stat.type ?? ''} ${stat.actionCode ?? ''}`,
      y: [stat.fullStat?.min ?? 0, stat.fullStat?.max ?? 0],
      origin: stat,
      click: (e: any) => {
        this.detail = stat;
      },
    };
  }

  private avgDataPoint(stat: ServerRequestExecutionStat): any {
    return {
      label: `${stat.viewName} ${stat.actionCode}`,
      y: stat.fullStat?.avg ?? 0,
      origin: stat,
      click: (e: any) => {
        this.detail = stat;
      },
    };
  }
}

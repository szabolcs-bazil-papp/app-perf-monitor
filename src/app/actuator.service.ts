import { Injectable } from '@angular/core';
import { ServerRequestExecutionStat } from './api/actuator/model/serverRequestExecutionStat';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActuatorService {
  constructor(private client: HttpClient) {}

  async getStatus(target: string): Promise<ServerRequestExecutionStat[]> {
    return (
      (await this.client
        .get<Array<ServerRequestExecutionStat>>(target, {
          responseType: 'json',
        })
        .toPromise()) ?? []
    );
  }
}

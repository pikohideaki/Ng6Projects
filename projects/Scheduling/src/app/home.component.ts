import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from './database/user/user.service';


@Component({
  selector: 'app-home',
  template: `
    <div class="body-with-padding">
      <app-app-list appName="Scheduling Apps" [apps$]="apps$"></app-app-list>
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {

  apps$: Observable<{
      routerLink:   string,
      inService:    boolean,
      title:        string,
      subtitle:     string,
      description?: string
    }[]>;

  constructor(
    private user: UserService
  ) {
    this.apps$
      = this.user.signedIn$
          .pipe( map( signedIn => [
            { routerLink: '/new-event', inService: true,
              title: 'New Event', subtitle: '新しいイベントを作成' },
            { routerLink: '/my-events', inService: signedIn,
              title: 'My Events', subtitle: '調整中のイベント' },
          ] ));
  }

  ngOnInit() {
  }
}

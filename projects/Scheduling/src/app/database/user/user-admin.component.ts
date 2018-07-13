import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-admin',
  template: `
    <div class="bodyWithoutHeader loginFormWrapper">
      <mat-tab-group class="center-window">
        <mat-tab label="ログイン">
          <app-login></app-login>
        </mat-tab>
        <mat-tab label="新規登録">
          <app-sign-up></app-sign-up>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .loginFormWrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .bodyWithoutHeader {
      height: calc(100vh - 64px);  /* subtract header height */
      width: 100vw;
    }
  `]
})
export class UserAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

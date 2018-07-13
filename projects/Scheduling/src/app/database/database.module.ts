import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { environment } from '../../environments/environment';

import { AngularFireModule         } from 'angularfire2';
import { AngularFireAuthModule     } from 'angularfire2/auth';
// import { AngularFirestoreModule    } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';


import { AngularMaterialModule } from '../angular-material.module';
import { MyLibModule } from '../my-lib/my-lib.module';

// auth
import { UserService         } from './user/user.service';
import { UserAdminComponent  } from './user/user-admin.component';
import { LoginComponent      } from './user/login/login.component';
import { SignUpComponent     } from './user/sign-up/sign-up.component';
import { MyPageComponent     } from './user/my-page.component';

import { DatabaseService } from './database.service';


@NgModule({
  imports: [
    CommonModule,
    AngularFireModule,
    AngularFireAuthModule,
    // AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularMaterialModule,
    MyLibModule,
  ],
  exports: [
  ],
  declarations: [
    UserAdminComponent,
    LoginComponent,
    SignUpComponent,
    MyPageComponent,
  ],
  entryComponents: [
    UserService,
    DatabaseService,
  ]
})
export class AppRoutingModule { }

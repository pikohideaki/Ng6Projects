import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { environment } from '../../environments/environment';

import { AngularFireModule         } from 'angularfire2';
import { AngularFireAuthModule     } from 'angularfire2/auth';
// import { AngularFirestoreModule    } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AngularMaterialModule } from '../angular-material.module';
import { MyLibModule } from '../my-lib/my-lib.module';


import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

// auth
import { UserService } from './user/user.service';
import { DatabaseService } from './database.service';

import { UserAdminComponent  } from './user/user-admin.component';
import { LoginComponent      } from './user/login/login.component';
import { SignUpComponent     } from './user/sign-up/sign-up.component';
import { MyPageComponent     } from './user/my-page.component';



@NgModule({
  imports: [
    CommonModule,
    AngularFireModule,
    // AngularFirestoreModule,
    AngularMaterialModule,
    MyLibModule,
    AngularFireModule.initializeApp(environment.firebase, 'PikoApps'), // imports firebase/app needed for everything
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
  ],
  exports: [
    UserAdminComponent,
    LoginComponent,
    SignUpComponent,
    MyPageComponent,
  ],
  declarations: [
    UserAdminComponent,
    LoginComponent,
    SignUpComponent,
    MyPageComponent,
  ],
  providers: [
    AngularFireAuth,
    AngularFireDatabase,
    UserService,
    DatabaseService,
  ],
})
export class DatabaseModule { }

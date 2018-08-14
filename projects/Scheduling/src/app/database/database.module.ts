import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { environment } from '../../environments/environment';

import { AngularFireModule         } from 'angularfire2';
import { AngularFireAuthModule     } from 'angularfire2/auth';
import { AngularFirestoreModule    } from 'angularfire2/firestore';
// import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AngularMaterialModule } from '../angular-material.module';
import { MyLibModule } from '../my-lib/my-lib.module';


import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
// import { AngularFireDatabase } from 'angularfire2/database';

// auth
import { UserService } from './user/user.service';
import { DatabaseService } from './database.service';
import { MyAngularFireDatabaseService } from './afdatabase.service';

import { UserAdminComponent  } from './user/user-admin.component';
import { LoginComponent      } from './user/login/login.component';
import { SignUpComponent     } from './user/sign-up/sign-up.component';
import { MyPageComponent     } from './user/my-page.component';

import { DatabaseTestComponent } from './database-test.component';


@NgModule({
  imports: [
    CommonModule,
    AngularFireModule,
    AngularMaterialModule,
    MyLibModule,
    AngularFireModule.initializeApp(environment.firebase, 'SchedulingApps'), // imports firebase/app needed for everything
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    // AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFirestoreModule,
  ],
  exports: [
    DatabaseTestComponent,
    UserAdminComponent,
    LoginComponent,
    SignUpComponent,
    MyPageComponent,
  ],
  declarations: [
    DatabaseTestComponent,
    UserAdminComponent,
    LoginComponent,
    SignUpComponent,
    MyPageComponent,
  ],
  providers: [
    AngularFireAuth,
    // AngularFireDatabase,
    AngularFirestore,
    UserService,
    DatabaseService,
    MyAngularFireDatabaseService,
  ],
})
export class DatabaseModule { }

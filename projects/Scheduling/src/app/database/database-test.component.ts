import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// import { AngularFirestore,
//          AngularFirestoreCollection,
//          AngularFirestoreDocument
//         } from 'angularfire2/firestore';

// import { MyAngularFireDatabaseService } from './afdatabase.service';
import { DatabaseService } from './database.service';
import { User } from './user/user';


@Component({
  selector: 'app-database-test',
  template: '',
  styles: [],
  providers: [
    // AngularFirestore,
    // MyAngularFireDatabaseService
  ],
})
export class DatabaseTestComponent implements OnInit {
  // private af_doc_users: AngularFirestoreDocument<any>;
  // private af_coll_users: AngularFirestoreCollection<any>;
  // users$: Observable<any>;

  constructor(
    private database: DatabaseService,
    // private afs: AngularFirestore,
    // private myafdb: MyAngularFireDatabaseService,
  ) {
    this.database.users$.subscribe( users => console.log( 'users', users ) );
    this.database.feedbacks$.subscribe( feedbacks => console.log( 'feedbacks', feedbacks ) );
    this.database.schedules$.subscribe( schedules => console.log( 'schedules', schedules ) );
    // this.database
    // this.af_coll_users = this.afs.collection('users');
    // this.af_doc_users = this.af_coll_users.doc<any>('ov8qiVcceXo1jCznGuhu');
    // this.users$ = this.af_coll_users.valueChanges();
    // this.addUsers();
    // this.users$.subscribe( console.log );
    this.database.user.add( new User({
      id:        '',
      timestamp: Date.now(),
      name:      'Hideaki',
      nameYomi:  'Hideaki',
    }) );
  }

  ngOnInit() {
  }

  // async addUsers() {
    // const docref = await this.af_coll_users.add({ name: 'user1', level: 1 });
    // console.log(docref);
    // docref.update({ id: docref.id });
    // await this.af_coll_users.add({ name: 'user2', level: 2 });
    // await this.af_coll_users.add({ name: 'user3', date: new Date() });
  // }

}

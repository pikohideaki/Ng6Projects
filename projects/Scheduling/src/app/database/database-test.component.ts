import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument,
         fromCollectionRef
        } from 'angularfire2/firestore';

// import { MyAngularFireDatabaseService } from './afdatabase.service';
import { DatabaseService } from './database.service';
import { User } from './user/user';
import { mergeMap, mergeMapTo } from 'rxjs/operators';


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
    private afs: AngularFirestore,
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

    // this.database.user.add({
    //   id:        '',
    //   name:      'Hideaki',
    //   nameYomi:  'Hideaki',
    //   timestamp: Date.now(),
    // })
    // const test = this.afs.collection('test');
    // test.add({ date: new Date(), timestamp: Date.now() });
    // test.valueChanges().subscribe( console.log );
    this.afsTest();
  }

  ngOnInit() {
  }

  async afsTest() {
    // const uid = await this.database.user.add( new User( {
    //   id:        '',
    //   name:      'Hideaki',
    //   nameYomi:  'Hideaki',
    //   timestamp: Date.now(),
    // }) );

    // this.afs.collection('users').doc(uid).update({ name: 'Noshiro'});

    const test = this.afs.collection('test');
    test.valueChanges().subscribe( v => console.log('test', v) );

    const docref = await test.add({
      aaa: [1, 2, 3],
      bbb: {
        ccc: 1,
        ddd: {
          eee: '123',
          fff: '456',
        }
      }
    });

    await docref.collection('ggg').add({ hhh: 'abc', iii: 'def' });
    this.afs.collection('test').doc(docref.id).collection('ggg').valueChanges()
      .subscribe( val => console.log('ggg', val) );
    console.log( docref.path );

    // test.valueChanges().pipe(
    //   mergeMapTo( )
    // )
    // docref.update( { bbb: { ddd: { fff: '789' } } } );
  }

  // async addUsers() {
    // const docref = await this.af_coll_users.add({ name: 'user1', level: 1 });
    // console.log(docref);
    // docref.update({ id: docref.id });
    // await this.af_coll_users.add({ name: 'user2', level: 2 });
    // await this.af_coll_users.add({ name: 'user3', date: new Date() });
  // }

}

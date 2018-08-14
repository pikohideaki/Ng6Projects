import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';

import { AngularFireAuth } from 'angularfire2/auth';

import { DatabaseService } from '../../database.service';

import { User } from '../user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styles: [`
    .wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
  `]
})
export class SignUpComponent implements OnInit {

  waitingForResponse = false;

  email:    string = '';
  password: string = '';
  name:     string = '';
  nameYomi: string = '';

  errorMessageForEmail:    string = '';
  errorMessageForPassword: string = '';


  constructor(
    public snackBar: MatSnackBar,
    public afAuth: AngularFireAuth,
    private location: Location,
    private database: DatabaseService
  ) {
  }

  ngOnInit() {
  }


  emailOnChange( email: string ) {
    this.email = email;
  }

  passwordOnChange( password: string ) {
    this.password = password;
  }

  nameOnChange( name: string ) {
    this.name = name;
  }

  nameYomiOnChange( nameYomi: string ) {
    this.nameYomi = nameYomi;
  }


  signUp() {
    this.errorMessageForEmail = '';
    this.errorMessageForPassword = '';

    this.waitingForResponse = true;
    this.afAuth.auth.createUserWithEmailAndPassword( this.email, this.password )
    .then( afUser => {
      this.waitingForResponse = false;

      this.database.user.add( new User( {
            id:        ( afUser.user || { uid: ''} ).uid,
            timestamp: Date.now(),
            name:      this.name,
            nameYomi:  this.nameYomi,
          } ) );

      this.location.back();
      this.openSnackBar('Successfully logged in!');
    } )
    .catch( (error: any) => {
      this.waitingForResponse = false;

      switch ( error.code ) {
        case 'auth/email-already-in-use' :
          this.errorMessageForEmail = error.message;
          break;
        case 'auth/invalid-email' :
          this.errorMessageForEmail = error.message;
          break;
        case 'auth/operation-not-allowed' :
          this.errorMessageForEmail = error.message;
          break;
        case 'auth/weak-password' :
          this.errorMessageForPassword = error.message;
          break;
        default :
          this.errorMessageForEmail = error.message;
          break;
      }
    } );
  }

  // private setDisplayName() {
  //   this.afAuth.auth.currentUser.updateProfile( { displayName: this.name, photoURL: '' } );
  // }


  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }
}

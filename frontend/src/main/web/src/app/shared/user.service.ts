import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  updateUserData = {updateName:'', updatePhone:'', updatePassword:'', updatePasswordAgain:'',password:''};
  newUserEmail='';
  userId :number;
  errors=[];

  constructor(private authenticationService:AuthenticationService, private http: HttpClient) {}
  getAllUser(): Observable<User[]>{
    return this.http.get<User[]>('/loginapp/admin/users').pipe(map(response=>{
      if(response){
        return Object.values(response);
      }
      return [];
    }));
  }
  getProfile(): Observable<any>{
    return this.http.get('/loginapp/user/profile');
  }

    updateCheck(){
    //let credentials={username:localStorage.getItem('user'), password:this.updateUserData.password}

    if(this.updateUserData.updatePassword !== this.updateUserData.updatePasswordAgain){
      this.errors.push("Az új jelszó nem egyezik!");
    }
    if(this.updateUserData.updatePassword.length<8){
      this.errors.push("Az új jelszó legalább 8 karakter kell, hogy legyen!");
    }
    /*if(this.authenticationService.pwCheck(credentials)){
      this.errors.push("Nem megfelelő jelszó");
    }*/
    return this.errors;

  }

  update():Observable<any>{
      const informations = {id: this.userId, updateName: this.updateUserData.updateName, updatePhone: this.updateUserData.updatePhone, updatePassword: this.updateUserData.updatePassword};
    return this.http.post('/loginapp/user/updateuser',informations);
  }
  newUser():Observable<any>{
    const informations = {id:0, email: this.newUserEmail, fullName: this.updateUserData.updateName, phone: this.updateUserData.updatePhone, password: this.updateUserData.updatePassword};
    return this.http.post('/loginapp/user/admin/newuser',informations);
  }
  deleteUser():Observable<any>{
    return this.http.post('/loginapp/user/admin/deleteuser',this.userId);
  }


  clear(){
    this.updateUserData.updateName='';
    this.updateUserData.updatePhone='';
    this.updateUserData.updatePassword='';
    this.updateUserData.updatePasswordAgain='';
    this.updateUserData.password='';
}
}

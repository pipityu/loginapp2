import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from "rxjs/operators";



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  credentials = {username:'',password:''};
  constructor(private http: HttpClient, private router: Router) { }

  authenticate(credentials, callback){
    if(this.credentials.username !== '' && this.credentials.password!==''){
    this.http.post('/loginapp/auth', {username: this.credentials.username, password: this.credentials.password},{observe: 'response'}).subscribe(response => {
        if(response.ok){
          localStorage.setItem('loggedIn', 'true');
          localStorage.removeItem('token');
          localStorage.setItem('token',response.body['jwt']);
          localStorage.setItem('user', credentials.username);
          this.authorization();
        }
      return callback && callback();
    });
  }else{
    return false;
  }
  }

  authorization(){
    this.http.get('/loginapp/getrole',{observe: 'response'}).subscribe(response => {
      console.log(response);
      if(response.ok){
        localStorage.removeItem('role');
        localStorage.setItem('role',response.body['role']);
        this.router.navigateByUrl('/loginapp/user/home');
      }
    })
  }


  logout() {
    this.http.post('/loginapp/logout', {}).pipe(
      finalize(() => {
          this.credentials.password='';
          this.credentials.username='';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          localStorage.setItem('loggedIn', 'false');
      })).subscribe();
  }

  login(){
    this.authenticate(this.credentials, () => {
    });
    return false;
  }


  async pwCheck(credentials):Promise<boolean>{
    let success=true;
    if(credentials.username !== '' && credentials.password!==''){
      await this.http.post('/loginapp/user/pwcheck', {username: credentials.username, password: credentials.password},{observe: 'response'}).toPromise()
      .then(()=>{return true})
      .catch(()=>{
        success = false;
      });

    }
    return success;

  }
}

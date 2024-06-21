import { Injectable } from '@angular/core';
import { RpcService } from 'src/app/services/rpc.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  // Object to store info about user
  userInfo: any;

  constructor(private rpcService: RpcService) {}

  getUserInfo(username: string): void {
    let params = {
      username: username,
    };

    this.rpcService.callRPC('auth.getUsers', params, (err: any, res: any) => {
      if (err || res.error) {
        console.log('nu s a putut afisa utilizatorul');
      }
      this.userInfo = res.result;
      sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
    });
  }

  setUserInfo(userInfo: any): void {
    this.userInfo = userInfo;
  }

  getUserInfoSync(): any {
    return this.userInfo;
  }
}

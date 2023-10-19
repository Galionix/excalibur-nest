import { Auth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

import { login } from '../api';
import { auth } from '../firebase';
import { EMapsEnum } from '../../assets/maps/maps';

export type TTEMPORARYUserData = {
  inventory: {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    // image: string;
  }[];

  player: {
    experience: number;
    name: string;
    character: string;
    level: number;
    hp: number;
    mana: number;
  };
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  location: {
    x: number;
    y: number;
    map: EMapsEnum;
    entry: string;
  };
};
type TStoredUserData = {
  uid: string;
  name: string;
};

export class Authorization {
  auth: Auth;
  provider: GoogleAuthProvider;
  signInWithPopup: typeof signInWithPopup;
  user: TStoredUserData = { uid: '', name: '' };
  // class managing auth with firebase and logging in with popup
  constructor() {
    this.auth = auth;
    this.auth.useDeviceLanguage();
    this.provider = new GoogleAuthProvider();
    // this.provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    this.provider.setCustomParameters({
      login_hint: 'name',
    });
    this.signInWithPopup = signInWithPopup;
    this.user = this.getUserFromLocalStorage();
  }

  // playerData;

  loginUser = async (uid: string) => {
    const res = await login(uid);
    return res;
  };

  // sign in with popup
  async signIn(
    cb: (result: TStoredUserData, loginData: TTEMPORARYUserData) => void
  ) {
    if (this.user.uid) {
      const loginData = await this.loginUser(this.user.uid);

      cb(this.user, loginData);
      return;
    }
    const result_1 = await this.signInWithPopup(this.auth, this.provider);

    const loginData = await this.loginUser(result_1.user?.uid as string);

    this.user = {
      uid: result_1.user?.uid as string,
      name: result_1.user?.displayName as string,
    };
    this.storeUserInLocalStorage();
    // this.uid = result_1.user?.uid;
    cb(this.user, loginData);
  }

  // sign out
  signOut() {
    localStorage.removeItem('uid');
    return this.auth.signOut();
  }

  // get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // get current user id
  getCurrentUserId() {
    return this.user.uid;
  }

  // get current user email
  getCurrentUserEmail() {
    return this.auth.currentUser?.email;
  }

  storeUserInLocalStorage() {
    localStorage.setItem('uid', this.getCurrentUserId() as string);
    localStorage.setItem('name', this.user.name);
  }

  getUserFromLocalStorage(): TStoredUserData {
    const uid = localStorage.getItem('uid');
    const name = localStorage.getItem('name');

    if (!uid || !name) {
      return {
        uid: '',
        name: '',
      };
    }
    return {
      uid: uid,
      name: name,
    };
  }
}

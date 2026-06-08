import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';

export interface UserProfile {
  nome: string;
  email: string;
  criadoEm: string;
  fotoUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);

  async saveProfile(uid: string, data: UserProfile): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}`);
    await setDoc(ref, data);
  }

  async getProfile(uid: string): Promise<UserProfile | null> {
    const ref = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  }

  async updateFotoUrl(uid: string, fotoUrl: string): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}`);
    await updateDoc(ref, { fotoUrl });
  }
}

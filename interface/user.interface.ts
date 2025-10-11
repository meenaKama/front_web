
type Role={
    user: "user",
    modo: "modo",
    admin:"admin"
}

type UserStatus = {
    onLine:'onLine',
    away: 'away',
    offLine:'offLine'
}

type Method2Fa = {
    email:'email',
    sms:'sms',
    totp :'totp'
}

export interface User {
  id: string;
  email: string;
  password?: string;
  secretName: string;
  phone?: string;
  phoneVerified?: boolean;
  googleId?: string;
  role: Role;
  status: UserStatus;
  avatar: string;
  is2FaEnable: boolean;
  twoFaMethod?: Method2Fa;
  twoFaVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  isVerified: boolean;
  verificationToken?: string;
  verificationExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

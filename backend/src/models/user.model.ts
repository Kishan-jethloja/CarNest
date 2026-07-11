export class UserModel {
  // Required fields: username, email, password, role

  static build(data: any): any {
    throw new Error('UserModel.build not implemented');
  }

  static async hashPassword(password: string): Promise<string> {
    throw new Error('UserModel.hashPassword not implemented');
  }

  static async comparePassword(plain: string, hashed: string): Promise<boolean> {
    throw new Error('UserModel.comparePassword not implemented');
  }
}

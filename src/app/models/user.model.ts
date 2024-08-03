import { UserResult } from './api-result.model';

interface LoginInfo extends Object {
  uuid: string;
}

export type UserGroup = {
  [key: string]: User[];
};

export type UsersGroups = {
  alphabetically?: UserGroup;
  nationality?: UserGroup;
  age?: UserGroup;
};


export class User {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  image?: string;
  nat?: string;
  country?: string;
  login?: LoginInfo;
  age?: number;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  /**
   * Gets an image source url with a query string to prevent caching
   * Note: Do not remove the query string.
   */
  get imageSrc(): string {
    return `${this.image}?id=${this.login?.uuid}`;
  }

  /**
   * Maps the api result to an array of User objects
   * @param {UserResult[]} userResults
   * @returns {User[]}
   */
  static mapFromUserResult(userResults: UserResult[]): User[] {
    return userResults.map(
      (user) =>
        new User({
          firstname: user.name.first,
          lastname: user.name.last,
          email: user.email,
          phone: user.phone,
          image: user.picture.thumbnail,
          nat: user.nat,
          country: user.location.country,
          login: user.login,
          age: user.dob.age,
        })
    );
  }
}

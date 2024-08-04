/// <reference lib="webworker" />

import { AGE_RANGE } from '../consts';
import { User, UsersGroups } from '../models/user.model';

const usersGroups: UsersGroups = {};
addEventListener('message', ({ data }: MessageEvent<User[]>) => {
  console.log('Calculating groups...');
  usersGroups.alphabetically = groupAlphabetically(data);
  usersGroups.nationality = groupByNationality(data);
  usersGroups.age = groupByAge(data);

  const p = sortAlphabetically(usersGroups.alphabetically);

  postMessage(usersGroups);
});

const groupAlphabetically = (users: User[]): { [key: string]: User[] } => {
  const alphabetObject = users.reduce(
    (usersAcc, user) => {
      if (user.firstname) {
        const key = user.firstname.charAt(0).toUpperCase();
        if (!usersAcc[key]) {
          usersAcc[key] = [];
        }
        usersAcc[key].push(user);
      }
      return usersAcc;
    },
    {} as { [key: string]: User[] },
  );

  //The endpoint might return names that do not start with a latin letters.
  return sortAlphabetically(alphabetObject);
};

const sortAlphabetically = (alphabetObject: {
  [key: string]: User[];
}): { [key: string]: User[] } => {
  const latinAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const latinAlphabetObj: { [key: string]: User[] } = {};
  const nonLatinAlphabetObj: { [key: string]: User[] } = {};
  Object.keys(alphabetObject).forEach((key: string) => {
    if (latinAlphabet.includes(key)) {
      latinAlphabetObj[key] = alphabetObject[key];
    } else {
      nonLatinAlphabetObj[key] = alphabetObject[key];
    }
  });

  const sortedObj = {
    ...latinAlphabetObj,
    ...nonLatinAlphabetObj,
  };
  return sortedObj;
};

const groupByNationality = (users: User[]): { [key: string]: User[] } => {
  return users.reduce(
    (usersAcc, user) => {
      if (user.nat) {
        const key = user.nat.toUpperCase();
        if (!usersAcc[key]) {
          usersAcc[key] = [];
        }
        usersAcc[key].push(user);
      }
      return usersAcc;
    },
    {} as { [key: string]: User[] },
  );
};

const groupByAge = (users: User[]): { [key: string]: User[] } => {
  const ageGroup = users.reduce(
    (usersAcc, user) => {
      if (user.age) {
        const key = getAgeRange(user.age);
        if (!usersAcc[key]) {
          usersAcc[key] = [];
        }
        usersAcc[key].push(user);
      }
      return usersAcc;
    },
    {} as { [key: string]: User[] },
  );
  const sortedAgeGroup: { [key: string]: User[] } = {};
  const ageRanges = Object.values(AGE_RANGE);
  ageRanges.forEach((key: string) => {
    if (ageGroup[key]) {
      sortedAgeGroup[key] = ageGroup[key];
    }
  });
  return sortedAgeGroup;
};

const getAgeRange = (age: number): AGE_RANGE => {
  switch (true) {
    case 0 <= age && age < 10:
      return AGE_RANGE.ZERO_TO_TEN;
    case 10 <= age && age < 20:
      return AGE_RANGE.TEN_TO_TWENTY;
    case 20 <= age && age < 30:
      return AGE_RANGE.TWENTY_TO_THIRTY;
    case 30 <= age && age < 40:
      return AGE_RANGE.THIRTY_TO_FOURTY;
    case 40 <= age && age < 50:
      return AGE_RANGE.FOURTY_TO_FIFTY;
    case 50 <= age && age < 60:
      return AGE_RANGE.FIFTY_TO_SIXTY;
    case 60 <= age && age < 70:
      return AGE_RANGE.SIXTY_TO_SEVENTY;
    case 70 <= age && age < 80:
      return AGE_RANGE.SEVENTY_TO_EIGHTY;
    case 80 <= age && age < 90:
      return AGE_RANGE.EIGHTY_TO_NINETY;
    case 90 <= age && age < 100:
      return AGE_RANGE.NINETY_TO_HUNDRED;
    case age >= 100:
      return AGE_RANGE.OLDER_THAN_HUNDRED;
    default:
      return AGE_RANGE.UNKOWN_AGE;
  }
};

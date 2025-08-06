import {
  dob_MD_MI_MN,
  eyeColor_NJ,
  firstInitial_FL_IL_WI,
  firstMiddleName_MD_MI_MN,
  firstName_FL_IL_WI,
  middleInitial_FL_IL_WI,
  middleInitial_NJ,
  middleName_MD_MI_MN,
} from '../const/dl-tables.const';
export const getRandNum = (min: number, max: number): number =>
  Math.round(Math.random() * (max - min) + min);
export const getRandChar = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
};
export const evenOrOdd = (num: number): boolean => !!(num % 2);
export const getRandomSymbols = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
};

export const getRandomDate = (range: number, DBB: string = '') => {
  let y = +DBB.slice(4, 8);
  const currDate: Date = new Date();

  const offset = 31536000000 * (range - 2);
  let result = new Date(0, 0, 0);
  if (DBB) {
    while (result.getFullYear() - 16 < y) {
      result = new Date(
        currDate.getTime() -
          offset +
          Math.random() * (currDate.getTime() - (currDate.getTime() - offset)),
      );
    }
  } else {
    result = new Date(
      currDate.getTime() -
        offset +
        Math.random() * (currDate.getTime() - (currDate.getTime() - offset)),
    );
  }
  return result;
};

export const dayInYear = (DBD: string): string => {
  const year = DBD.slice(4, 8);
  const month = DBD.slice(0, 2);
  const day = DBD.slice(2, 4);
  let result = 0;
  for (let i = 1; i <= +month; i++) {
    result += i == +month ? +day : new Date(+year, i, 0).getDate();
  }
  return result.toString().padStart(3, '0');
};

export const amerSoundex = (input: string, strictRules: boolean): string => {
  let result = '';
  let lastcode = '';
  let first = true;
  for (let i = 0; i < input.length; i++) {
    let ch = input.charAt(i).toLowerCase();
    if (ch < 'a' || ch > 'z') {
      continue;
    }
    switch (ch) {
      case 'b':
      case 'f':
      case 'p':
      case 'v':
        if (lastcode != '1') {
          result += '1';
          lastcode = '1';
        }
        break;
      case 'c':
      case 'g':
      case 'j':
      case 'k':
      case 'q':
      case 's':
      case 'x':
      case 'z':
        if (lastcode != '2') {
          result += '2';
          lastcode = '2';
        }
        break;
      case 'd':
      case 't':
        if (lastcode != '3') {
          result += '3';
          lastcode = '3';
        }
        break;
      case 'l':
        if (lastcode != '4') {
          result += '4';
          lastcode = '4';
        }
        break;
      case 'm':
      case 'n':
        if (lastcode != '5') {
          result += '5';
          lastcode = '5';
        }
        break;
      case 'r':
        if (lastcode != '6') {
          result += '6';
          lastcode = '6';
        }
        break;
      case 'a':
      case 'e':
      case 'i':
      case 'o':
      case 'u':
      case 'y':
        lastcode = '';
        break;
      case 'w':
      case 'h':
        if (!strictRules) {
          lastcode = '';
        }
        break;
    }
    if (first) {
      result = input.charAt(i).toUpperCase();
      first = false;
    }
    if (result.length >= 4) {
      break;
    }
  }
  if (result.length == 1) {
    result += '000';
  } else if (result.length == 2) {
    result += '00';
  } else if (result.length == 3) {
    result += '0';
  }
  return result;
};
export const soundex_MD_MI_MN = (
  firstName: string = '',
  middleName: string = '',
  lastName: string = '',
  dob: string = '',
  sep = ' ',
): string => {
  let [month, day] = [dob.slice(0, 2), dob.slice(2, 4)];
  let lastCode: string = amerSoundex(lastName, true);
  if (lastCode == '') {
    lastCode = '0000'; // so that initial display of license doesn't look strange
  }
  let firstCode: string = '000';
  let middleCode: string = '000';
  let dobCode: string = '000';
  let fullyCoded: boolean = true;
  let firstUnused = '';
  // encode first and middle name
  for (let i = firstMiddleName_MD_MI_MN.length - 1; i >= 0; i--) {
    // start from end to get longest match
    let target = firstMiddleName_MD_MI_MN[i][0].toUpperCase();
    if (target.length > firstName.length) {
      continue;
    }
    if (firstName.substr(0, target.length) == target) {
      firstCode = String(firstMiddleName_MD_MI_MN[i][1]);
      fullyCoded = firstName == target;
      if (!fullyCoded) {
        firstUnused = firstName.charAt(target.length);
      }
      break;
    }
  }
  firstCode = firstCode.padStart(3, '0');
  if (middleName != '') {
    for (let i = firstMiddleName_MD_MI_MN.length - 1; i >= 0; i--) {
      // start from end to get longest match
      let target = firstMiddleName_MD_MI_MN[i][0].toUpperCase();
      if (target.length > middleName.length) {
        continue;
      }
      if (middleName.substr(0, target.length) == target) {
        middleCode = String(firstMiddleName_MD_MI_MN[i][1]);
        break;
      }
    }
  } else {
    // middle name is blank
    if (fullyCoded) {
      middleCode = '000';
    } else {
      for (let i = 0; i < middleName_MD_MI_MN.length; i++) {
        if (middleName_MD_MI_MN[i][0] == firstUnused) {
          middleCode = String(middleName_MD_MI_MN[i][1]);
          break;
        }
      }
    }
  }
  middleCode = middleCode.padStart(3, '0');
  // encode date of birth
  if (month != '00') {
    // don't encode dob if no month is specified
    let dob = month + day;
    for (var i = 0; i < dob_MD_MI_MN.length; i++) {
      if (dob_MD_MI_MN[i][0] == dob) {
        dobCode = String(dob_MD_MI_MN[i][1]);
        break;
      }
    }
  }
  dobCode = dobCode.padStart(3, '0');
  console.log(
    `${lastCode}${sep}${firstCode}${sep}${middleCode}${sep}${dobCode}`,
  );
  return `${lastCode}${sep}${firstCode}${sep}${middleCode}${sep}${dobCode}`;
};
export const soundex_FL_IL_WI = (
  firstName: string = '',
  middleName: string = '',
  lastName: string = '',
  dob: string = '',
  state: string = '',
  gender: number = 0,
  sep = ' ',
): string => {
  let lastCode = amerSoundex(lastName, true) || '0000';
  let firstCode: string | number = '000';
  let middleCode = '000';
  let dobCode: string | number = '000';

  let [month, day, year] = [dob.slice(0, 2), dob.slice(2, 4), dob.slice(4, 8)];
  // encode first and middle name

  if (firstName.length == 0) {
    firstCode = 0;
  } else {
    let found = false;
    for (let i = 0; i < firstName_FL_IL_WI.length; i++) {
      if (firstName_FL_IL_WI[i][0].toUpperCase() == firstName) {
        firstCode = firstName_FL_IL_WI[i][1];
        found = true;
        break;
      }
    }
    if (!found) {
      // exact name was not found, go by the initial
      let firstInitial = firstName.charAt(0).toUpperCase();
      for (let i = 0; i < firstInitial_FL_IL_WI.length; i++) {
        if (firstInitial_FL_IL_WI[i][0].toUpperCase() == firstInitial) {
          firstCode = firstInitial_FL_IL_WI[i][1];
          break;
        }
      }
    }
  }
  if (middleName.length == 0) {
    middleCode = '';
  } else {
    let middleInitial = middleName.charAt(0).toUpperCase();
    for (let i = 0; i < middleInitial_FL_IL_WI.length; i++) {
      if (middleInitial_FL_IL_WI[i][0].toUpperCase() == middleInitial) {
        middleCode = middleInitial_FL_IL_WI[i][1];
        break;
      }
    }
  }
  firstCode = String(+firstCode - -middleCode);
  firstCode = firstCode.padStart(3, '0');
  // encode year
  var yearCode = year;

  // encode dob and gender

  var multiplier = 0;
  var genderCode = 0;
  if (state == 'FL' || state == 'WI') {
    multiplier = 40;
    if (gender == 2) {
      genderCode = 500;
    }
  } else if (state == 'IL') {
    multiplier = 31;
    if (gender == 2) {
      genderCode = 600;
    }
  }
  dobCode = String((+month - 1) * multiplier - -day - -genderCode);
  dobCode = dobCode.padStart(3, '0');

  // format the license

  if (state == 'FL') {
    return `${lastCode}${sep}${firstCode}${sep}${yearCode.slice(2, 4)}${sep}${dobCode}${sep}${getRandNum(0, 9)}`;
  } else if (state == 'IL') {
    return `${lastCode}${sep}${firstCode}${yearCode.charAt(2)}${sep}${yearCode.charAt(3)}${dobCode}`;
  } else if (state == 'WI') {
    return `${lastCode}${sep}${firstCode}${yearCode.charAt(2)}${sep}${yearCode.charAt(3)}${dobCode}${sep}${getRandNum(10, 99)}`;
  }
  return '';
};
export const dl_NJ = (
  firstName: string = '',
  middleName: string = '',
  lastName: string = '',
  dob: string = '',
  gender: number = 0,
  eyeColor: string = '',
) => {
  let firstCode = `${getRandNum(0, 999)}`.padStart(3, '0');

  let middleInitial = '';
  if (middleName != '') {
    middleInitial = middleName.charAt(0).toUpperCase();
  }
  let middleInitialCode = '';
  for (let i = 0; i < middleInitial_NJ.length; i++) {
    if (middleInitial_NJ[i][0] == middleInitial) {
      middleInitialCode = middleInitial_NJ[i][1];
      break;
    }
  }

  let monthCode = dob.slice(0, 2);
  if (gender == 2) {
    monthCode = String(50 + Number(monthCode));
  }

  let yearCode = dob.slice(6, 8);
  let eyeColorCode = '';

  eyeColorCode = '?';
  for (var i = 0; i < eyeColor_NJ.length; i++) {
    if (eyeColor_NJ[i][0] == eyeColor) {
      eyeColorCode = eyeColor_NJ[i][1];
      break;
    }
  }

  return `${lastName.charAt(0).toUpperCase()}${getRandNum(0, 9999).toString().padStart(4, '0')} ${firstCode}${middleInitialCode} ${monthCode}${yearCode}${eyeColorCode}`;
};

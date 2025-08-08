import { fN } from 'src/shared/const/fields-names.const';
import { getRandomDate } from 'src/shared/helper/functions.helper';

export async function dlIssueExpirationDates(
  req: Record<string, string>,
): Promise<Record<string, string>> {
  const DAJ: string = req.DAJ as string;
  const DBB: string = req.DBB as string;
  const DDB: string = req.DDB as string;
  const DDA: string = req.DDA as string;
  const result: Record<string, string> = {};
  let range = 0,
    years,
    month = 0,
    days = 0;
  let IssueDate, ExpirationDate;
  switch (
    DAJ // TODO check all
  ) {
    case 'CA': // California
      range = 5;
      break;
    case 'UT': // Utah 2017 2021
      range = DDB === '04152016' ? 5 : 8;
      break;
    case 'MI':
      range = 4;
      break;
    case 'IL':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        ((range = 4), (month = 3));
      } else if (years < 81) {
        range = 4;
      } else if (81 <= years && years <= 86) {
        range = 2;
      } else {
        range = 1;
      }
      break;
    case 'NV':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years > 64) {
        range = 4;
      } else {
        range = 8;
      }
      break;
    case 'GA':
      range = 8;
      break;
    case 'NC':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years <= 65) {
        range = 8;
      } else if (years > 65) {
        range = 5;
      }
      break;
    case 'MA':
      range = 5;
      break;
    case 'MN':
      range = 4;
      break;
    case 'CT':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years <= 65) {
        range = 6;
      } else if (years > 65) {
        range = 2;
      }
      break;
    case 'MO':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years >= 21 && years < 69) {
        range = 6;
      } else if (years >= 69) {
        range = 3;
      } else if (years < 21) {
        range = 21 - years;
      }
      break;
    case 'IA':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 73) {
        range = 8;
      } else if (years < 79) {
        range = 80 - years;
      } else {
        range = 1;
      }
      break;
    case 'MT':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        range = 21 - years;
      } else if (years > 67 && years < 75) {
        range = 75 - years;
      } else if (years >= 75) {
        range = 4;
      } else {
        range = 8;
      }
      break;
    case 'NE':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        range = 21 - years;
      } else {
        range = 5;
      }
      break;
    case 'RI':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 70) {
        range = 5;
      } else if (years < 71) {
        range = 4;
      } else if (years < 72) {
        range = 3;
      } else {
        range = 2;
      }
      break;
    case 'ID':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years >= 63) {
        range = 4;
      } else if (years < 21) {
        ((range = 21 - years), (days = 5));
      } else {
        range = 8;
      }
      break;
    case 'WV':
      range = 8;
      break;
    case 'AZ':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      range = 65;
      IssueDate = getRandomDate(range, DBB);
      if (years > 65) {
        range = 5;
      } else if (IssueDate.getFullYear() < 2017) {
        ExpirationDate = `${DBB.slice(0, 2)}${(+DBB.slice(2, 4) + days).toString().padStart(2, '0')}${+DBB.slice(4, 8) + 65}`;
        result[fN['DBD']] =
          `${IssueDate.getMonth() + 1}`.padStart(2, '0') +
          `${IssueDate.getDate()}`.padStart(2, '0') +
          `${IssueDate.getFullYear()}`;
        result[fN['DBA']] = ExpirationDate;
        return result;
      } else if (IssueDate.getFullYear() == 2017 && IssueDate.getMonth() <= 6) {
        ExpirationDate = `${DBB.slice(0, 2)}${(+DBB.slice(2, 4) + days).toString().padStart(2, '0')}${+DBB.slice(4, 8) + 65}`;
        result[fN['DBD']] =
          `${IssueDate.getMonth() + 1}`.padStart(2, '0') +
          `${IssueDate.getDate()}`.padStart(2, '0') +
          `${IssueDate.getFullYear()}`;
        result[fN['DBA']] = ExpirationDate;
        return result;
      } else {
        if (DDA == 'F') {
          range = 8;
        } else if (DDA == 'N') {
          ExpirationDate = `${DBB.slice(0, 2)}${(+DBB.slice(2, 4) + days).toString().padStart(2, '0')}${+DBB.slice(4, 8) + 65}`;
          result[fN['DBD']] =
            `${IssueDate.getMonth() + 1}`.padStart(2, '0') +
            `${IssueDate.getDate()}`.padStart(2, '0') +
            `${IssueDate.getFullYear()}`;
          result[fN['DBA']] = ExpirationDate;
          return result;
        } else {
          range = 12;
        }
      }
      break;
    case 'KS':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        range = 21 - years;
      } else if (years < 64) {
        range = 6;
      } else {
        range = 4;
      }
      break;
    case 'PA':
      range = 4;
      days = 1;
      break;
    case 'AR':
      range = 8;
      days = 30;
      break;
    case 'FL':
      range = 8;
      break;
    case 'MS':
      range = [4, 8][Math.floor(Math.random() * 2)];
      break;
    case 'ND':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 78) range = 6;
      else range = 4;
      break;
    case 'KY':
      range = 4;
      days = 32;
      break;
    case 'TN':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        range = 21 - years;
      } else {
        range = 8;
      }
      break;
    case 'DE':
      range = 8;
      break;
    case 'IN':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        ((range = 21 - years), (days = 30));
      } else if (years > 85) {
        range = 2;
      } else if (years > 75) {
        range = 3;
      } else {
        range = 6;
      }
      break;
    case 'WA':
      range = 6;
      break;
    case 'SC':
      range = 8;
      break;
    case 'NJ':
      range = 4;
      break;
    case 'OR':
      range = 8;
      break;
    case 'TX':
      range = 8;
      break;
    case 'CO':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        range = 21 - years;
      } else {
        if (DDA == 'F') {
          range = 5;
        } else {
          range = 3;
        }
      }
      break;
    case 'MD':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        ((range = 21 - years), (days = 60));
      } else {
        range = 8;
      }
      break;
    case 'WI':
      range = 8;
      break;
    case 'LA':
      range = 6;
      break;
    case 'AL':
      range = 4;
      break;
    case 'VA':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years > 75) {
        range = 5;
      } else {
        range = 8;
      }
      break;
    case 'OH':
      range = 4;
      break;
    case 'NM':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        ((range = 21 - years), (days = 30));
      } else if (years > 74) {
        ((range = 75 - years), (days = 30));
      } else {
        ((range = 6), (days = 30));
      }
      break;
    case 'NY':
      range = 8;
      break;
    case 'NH':
      years = new Date().getFullYear() - +DBB.slice(4, 8);
      if (years < 21) {
        range = 21 - years;
      } else {
        range = 5;
      }
      break;
    default:
      break;
  }
  IssueDate = getRandomDate(range, DBB);
  const dd = new Date(
    +IssueDate.getFullYear() + range,
    +DBB.slice(0, 2) - 1 + month,
    +DBB.slice(2, 4) + days,
  );
  ExpirationDate = `${(dd.getMonth() + 1 + month).toString().padStart(2, '0')}${dd.getDate().toString().padStart(2, '0')}${dd.getFullYear()}`;
  result[fN['DBD']] =
    `${IssueDate.getMonth()}`.padStart(2, '0') +
    `${IssueDate.getDate()}`.padStart(2, '0') +
    `${IssueDate.getFullYear()}`;
  result[fN['DBA']] = ExpirationDate;
  return result;
}

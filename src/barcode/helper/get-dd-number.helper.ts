import { fN } from 'src/shared/const/fields-names.const';
import {
  dayInYear,
  getRandChar,
  getRandNum,
  getRandomSymbols,
} from 'src/shared/helper/functions.helper';

export async function getDDNumber(
  req: Record<string, string>,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const DAJ = req.DAJ;
  const { DBD, DDB, DBA, DCK, DBB, DBC, DCS, DAC, DAQ, QQQ, DCJ } = req;
  switch (DAJ) {
    case 'CA':
      result[fN['DCF']] =
        `${DBD.slice(0, 2)}/${DBD.slice(2, 4)}/${DBD.slice(4, 8)}${getRandomSymbols(5)}/${getRandomSymbols(4)}/${DBA.slice(6, 8)}`;
      break;
    case 'UT':
      result[fN['DCF']] = `${getRandNum(1000, 99999999)}`.padStart(8, '0');
      break;
    case 'MI':
      result[fN['DCF']] = `${getRandNum(1000, 9999999999999)}`.padStart(
        13,
        '0',
      );
      break;
    case 'IL':
      result[fN['DCF']] =
        `${DBD.slice(4, 8)}${DBD.slice(0, 4)}${getRandNum(100, 999)}${getRandChar(2)}${getRandNum(1000, 9999)}`;
      break;
    case 'NV':
      if (DDB == '10102008') {
        result[fN['DCF']] =
          `000${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(10, 99)}${getRandNum(1000, 9999)}`;
      } else {
        result[fN['DCF']] =
          `000${getRandNum(100000000, 999999999)}${getRandNum(100000000, 999999999)}`;
      }
      break;
    case 'GA':
      if (DDB != '01022019') {
        result[fN['DCF']] = `${DCK.slice(0, 11)}00401`;
      } else {
        result[fN['DCF']] =
          `${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(100, 999)}00${getRandNum(10000, 99999)}`;
      }
      break;
    case 'NC':
      result[fN['DCF']] = `00${getRandNum(10000000, 99999999)}`;
      break;
    case 'MA':
      let m = DBD.slice(0, 2);
      let d = DBD.slice(2, 4);
      result[fN['DCF']] = `${m}/${d}/${DBD.slice(4, 8)} Rev 02/22/2016`;
      break;
    case 'MN':
      result[fN['DCF']] = `0000000${getRandNum(1000000, 9999999)}`;
      break;
    case 'CT':
      result[fN['DCF']] =
        `${DBD.slice(6, 8)}${DBD.slice(0, 4)}${getRandNum(10000000, 99999999)}MVE1`;
      break;
    case 'MO':
      result[fN['DCF']] =
        `${DBD.slice(6, 8)}${getRandNum(1000000000, 9999999999)}`;
      break;
    case 'IA':
      result[fN['DCF']] =
        `${getRandNum(1000000000, 9999999999)}${getRandChar(2)}${getRandNum(1000, 9999)}${getRandChar(1)}${getRandNum(100000, 999999)}${getRandChar(1)}`;
      break;
    case 'MT':
      result[fN['DCF']] =
        `${DBD.slice(4, 8)}${DBD.slice(0, 4)}${getRandNum(100000000000, 999999999999)}`;
      break;
    case 'NE':
      result[fN['DCF']] =
        `054${DCK}${DBD.slice(6, 8)}${(+dayInYear(DBD) + 1).toString().padStart(3, '0')}`;
      break;
    case 'RI':
      result[fN['DCF']] = `${getRandNum(1000000, 9999999)}`;
      break;
    case 'ID':
      result[fN['DCF']] =
        `${getRandNum(1000000, 9999999)}${getRandNum(10000000, 99999999)}`;
      break;
    case 'WV':
      result[fN['DCF']] =
        `${DBB.slice(0, 4)}${DBB.slice(6, 8)}TN${DBA.slice(6, 8)}${DBA.slice(2, 4)}`;
      break;
    case 'AZ':
      // TODO ??
      if (+DBD.slice(4, 8) < 2020) {
        result[fN['DCF']] =
          `4016MV${getRandNum(100, 999)}${DCS.slice(0, 1)}${getRandNum(100, 999)}${DBD.slice(7, 8)}${DAC.slice(0, 1)}${DBB.slice(7, 8)}`;
      } else if (+DBD.slice(4, 8) == 2020 && +DBD.slice(0, 2) < 5) {
        result[fN['DCF']] =
          `4016MV${getRandNum(100, 999)}${DCS.slice(0, 1)}${getRandNum(100, 999)}${DBD.slice(7, 8)}${DAC.slice(0, 1)}${DBB.slice(7, 8)}`;
      } else {
        result[fN['DCF']] =
          `0${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandChar(1)}${getRandNum(0, 9)}${DCS.slice(0, 1)}0${getRandNum(100, 999)}01`;
      }
      break;
    case 'KS':
      result[fN['DCF']] =
        `${getRandNum(10000000000, 99999999999)}WM${DBD.slice(6, 8)}${dayInYear(DBD)}${+DBC === 1 ? 'M' : 'F'}${DBA.slice(6, 8)}${DBA.slice(2, 4)}${getRandChar(2)}`;
      break;
    case 'PA':
      result[fN['DCF']] =
        `${DBD.slice(6, 8)}${dayInYear(DBD)}${DBB.slice(2, 4)}${DBD.slice(2, 4)}4${getRandNum(1000, 9999)}000000${getRandNum(10000, 99999)}`;
      break;
    case 'AR':
      result[fN['DCF']] =
        `${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)} 0601`;
      break;
    case 'FL':
      result[fN['DCF']] =
        `${getRandChar(1)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'MS':
      result[fN['DCF']] =
        `${getRandNum(1, 9)}${getRandChar(1)}${getRandNum(1, 9)}${getRandChar(1)}${getRandChar(2)}0${getRandNum(100, 999)}${DCS.slice(0, 1).toUpperCase()}${DAC.slice(0, 1).toUpperCase()}${DBD.slice(6, 8).toUpperCase()}${dayInYear(DBD)}${+DBC == 1 ? 'M' : 'F'}${DBA.slice(6, 8)}${DBA.slice(2, 4)}${getRandChar(1)}`;
      break;
    case 'ND':
      result[fN['DCF']] =
        `${DAQ}${DCS.slice(0, 1)}${DAC.slice(0, 1)}${getRandNum(1, 9)}${DBA.slice(6, 8)}${DBA.slice(2, 4)}${getRandChar(1).toLowerCase()}${getRandChar(1)}${getRandNum(10, 99)}NDZ`;
      break;
    case 'KY':
      result[fN['DCF']] =
        `${DBD.slice(4, 8)}${DBD.slice(0, 4)}${getRandNum(10, 99)}${getRandNum(10, 99)}${getRandNum(10, 99)}${getRandNum(10, 99)} 01111`;
      break;
    case 'TN':
      result[fN['DCF']] =
        `${getRandNum(100, 999)}${DBD.slice(6, 8)}${DBD.slice(0, 4)}${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
      break;
    case 'DE':
      result[fN['DCF']] =
        `${QQQ == 'DL' ? 'L' : 'I'}${DBD.slice(4, 8)}${DBD.slice(0, 4)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandChar(1)}`;
      break;
    case 'IN':
      result[fN['DCF']] =
        `${DBD.slice(0, 4)}${DBD.slice(6, 8)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
      break;
    case 'WA':
      result[fN['DCF']] = `${DAQ}${DCJ}`;
      break;
    case 'SC':
      result[fN['DCF']] =
        `${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
      break;
    case 'NJ':
      result[fN['DCF']] =
        `${getRandChar(2)}${DBD.slice(4, 8)}${dayInYear(DBD)}${getRandNum(1, 99999999).toString().padStart(8, '0')}`;
      break;
    case 'OR':
      result[fN['DCF']] =
        `${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'TX':
      if (DDB != `10102016`) {
        result[fN['DCF']] =
          `${DBD.slice(6, 8)}${dayInYear(DBD)}0100${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}`;
      } else {
        result[fN['DCF']] =
          `${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}`;
      }
      break;
    case 'CO':
      result[fN['DCF']] =
        `${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
      break;
    case 'MD':
      result[fN['DCF']] =
        `${getRandNum(1000, 9999)}${getRandChar(1)}${getRandNum(10, 99)}${getRandChar(1)}${getRandNum(0, 9)}`;
      break;
    case 'WI':
      result[fN['DCF']] =
        `${getRandChar(3)}${[getRandChar(2), getRandNum(10, 99)][getRandNum(0, 1)]}${DBD.slice(4, 8)}${DBD.slice(0, 4)}${getRandNum(1000, 9999)}${DBA.slice(6, 8)}${getRandNum(10, 99)}`;
      break;
    case 'LA':
      result[fN['DCF']] = `NONE`;
      break;
    case 'AL':
      result[fN['DCF']] = `NONE`;
      break;
    case 'VA':
      if (DDB == '04222023') {
        result[fN['DCF']] =
          `0${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}`;
      } else {
        result[fN['DCF']] =
          `0060100${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(1, 9)}`;
      }
      break;
    case 'OH':
      result[fN['DCF']] =
        `${getRandChar(1)}${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}`;
      break;
    case 'NM':
      result[fN['DCF']] = `unavl`;
      break;
    case 'NY':
      if (DDB == '09282017') {
        result[fN['DCF']] =
          `H${getRandNum(10, 99)}${getRandChar(2)}${getRandNum(0, 9)}${getRandChar(1)}${getRandNum(100, 999)}`;
      } else {
        result[fN['DCF']] =
          `${[getRandChar(1), getRandNum(0, 9)][getRandNum(0, 1)]}${[getRandChar(1), getRandNum(0, 9)][getRandNum(0, 1)]}${[getRandChar(1), getRandNum(0, 9)][getRandNum(0, 1)]}${[getRandChar(1), getRandNum(0, 9)][getRandNum(0, 1)]}${[getRandChar(1), getRandNum(0, 9)][getRandNum(0, 1)]}${[getRandChar(1), getRandNum(0, 9)][getRandNum(0, 1)]}${getRandNum(10, 99)}`;
      }
      break;
    case 'NH':
      result[fN['DCF']] = `${DCK}`;
      break;
    default:
      break;
  }
  return result;
}

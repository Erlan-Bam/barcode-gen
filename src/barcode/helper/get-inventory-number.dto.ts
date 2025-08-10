import { fN } from 'src/shared/const/fields-names.const';
import {
  dayInYear,
  getRandChar,
  getRandNum,
} from 'src/shared/helper/functions.helper';

export async function getInventoryNumber(
  req: Record<string, string>,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const DAJ: string = req.DAJ as string;
  const DDB: string = req.DDB as string;
  const { DBD, DAQ, DBA, DBB } = req;
  switch (DAJ) {
    case 'CA':
      result[fN['DCK']] = `${DBD.slice(6, 8)}${dayInYear(DBD)}${DAQ}0401`;
      break;
    case 'UT':
      if (DDB === '04152016') {
        result[fN['DCK']] = `${DAQ}UT18C01`;
      }
      if (DDB === '06012021') {
        result[fN['DCK']] = `${DAQ}UTGMSL01`;
      }
      break;
    case 'MI':
      result[fN['DCK']] = `${DAQ.replaceAll(' ', '')}${DBB.slice(4, 8)}${DBA}`;
      break;
    case 'IL':
      result[fN['DCK']] = `${DAQ.replaceAll('-', '')}IL${getRandChar(2)}TL01`;
      break;
    case 'NV':
      result[fN['DCK']] = `00${getRandNum(100000000, 999999999)}01`;
      break;
    case 'GA':
      if (DDB != `01022019`) {
        result[fN['DCK']] = `${getRandNum(10000000000, 99999999999)}0042470`;
      } else {
        result[fN['DCK']] = `1000${getRandNum(1000000, 9999999)}`;
      }
      break;
    case 'NC':
      result[fN['DCK']] = `0000${getRandNum(10000000, 99999999)}NCPATL01`;
      break;
    case 'MA':
      result[fN['DCK']] = `${DBD.slice(6, 8)}${dayInYear(DBD)}${DAQ}0601`;
      break;
    case 'MN':
      result[fN['DCK']] = `${DAQ.replaceAll('-', '')}0128701`;
      break;
    case 'CT':
      result[fN['DCK']] = `${DAQ}CT2MTL01`;
      break;
    case 'MO':
      result[fN['DCK']] =
        `${DBD.slice(6, 8)}${(+dayInYear(DBD) + 1).toString().padStart(3, '0')}${DAQ}0101`;
      break;
    case 'IA':
      result[fN['DCK']] =
        `${DAQ}${DBD.slice(6, 8)}${(+dayInYear(DBD) + 1).toString().padStart(3, '0')}0101`;
      break;
    case 'MT':
      result[fN['DCK']] =
        `11011${getRandChar(1)}${getRandNum(1, 9)}${getRandChar(3)}${getRandNum(1, 9)}${getRandChar(6)}001`;
      break;
    case 'NE':
      result[fN['DCK']] =
        `${DAQ}NE${getRandChar(1)}${getRandNum(1, 9)}${getRandChar(2)}01`;
      break;
    case 'RI':
      result[fN['DCK']] = `${getRandChar(1)}${DAQ}RI${getRandChar(4)}01`;
      break;
    case 'ID':
      result[fN['DCK']] = `${DAQ}${DBD.slice(6, 8)}${dayInYear(DBD)}1001`;
      break;
    case 'WV':
      result[fN['DCK']] = `${DAQ}WV${getRandChar(4)}01`;
      break;
    case 'AZ':
      // TODO ??
      result[fN['DCK']] =
        `${DBD.slice(6, 8)}${dayInYear(DBD)}AZ00${getRandNum(100000, 999999)}00301`;
      break;
    case 'KS':
      result[fN['DCK']] =
        `${DBD.slice(6, 8)}${dayInYear(DBD)}K${DAQ.replaceAll('-', '')}0101`;
      break;
    case 'PA':
      result[fN['DCK']] =
        `02500010${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}`;
      break;
    case 'AR':
      result[fN['DCK']] =
        `0210${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'FL':
      result[fN['DCK']] =
        `0100${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'MS':
      result[fN['DCK']] =
        `05100${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}`;
      break;
    case 'ND':
      result[fN['DCK']] =
        `03400${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}`;
      break;
    case 'KY':
      result[fN['DCK']] =
        `0460${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'TN':
      result[fN['DCK']] =
        `${DBD.slice(6, 8)}${dayInYear(DBD)}0${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'DE':
      result[fN['DCK']] =
        `0110${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'IN':
      result[fN['DCK']] =
        `0370${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'WA':
      result[fN['DCK']] =
        `2000${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'SC':
      result[fN['DCK']] =
        `101${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
      break;
    case 'NJ':
      result[fN['DCK']] =
        `${[getRandChar(4), getRandChar(3) + getRandNum(1, 9), getRandChar(2) + getRandNum(10, 99), getRandChar(1) + getRandNum(100, 999)][Math.floor(Math.random() * 4)]}${[getRandChar(4), getRandChar(3) + getRandNum(1, 9), getRandChar(2) + getRandNum(10, 99), getRandChar(1) + getRandNum(100, 999)][Math.floor(Math.random() * 4)]}${[getRandChar(4), getRandChar(3) + getRandNum(1, 9)][Math.floor(Math.random() * 2)]}NJ${[getRandChar(4), getRandChar(3) + getRandNum(1, 9), getRandChar(2) + getRandNum(10, 99), getRandChar(1) + getRandNum(100, 999)][Math.floor(Math.random() * 4)]}01`;
      break;
    case 'OR':
      result[fN['DCK']] =
        `${getRandChar(2)}${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
      break;
    case 'TX':
      if (DDB != '10102016') {
        result[fN['DCK']] =
          `1000${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
      } else {
        result[fN['DCK']] = `${DAQ} ${DBD.slice(4, 8)}${DBD.slice(0, 4)}`;
      }
      break;
    case 'CO':
      result[fN['DCK']] =
        `000${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
      break;
    case 'MD':
      result[fN['DCK']] = `100${getRandNum(1000000, 9999999)}`;
      break;
    case 'WI':
      result[fN['DCK']] =
        `0130100${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
      break;
    case 'LA':
      result[fN['DCK']] =
        `007008${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(10, 99)}`;
      break;
    case 'AL':
      result[fN['DCK']] =
        `0000000000${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}01`;
      break;
    case 'VA':
      if (DDB == '04222023') {
        result[fN['DCK']] =
          `906190000${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(1, 9)}`;
      } else {
        result[fN['DCK']] =
          `0${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}`;
      }
      break;
    case 'OH':
      result[fN['DCK']] = `0${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}`;
      break;
    case 'NM':
      result[fN['DCK']] = `${DAQ}01`;
      break;
    case 'NY':
      if (DDB == `09282017`) {
        result[fN['DCK']] =
          `01${getRandNum(100, 999)} 00${getRandNum(100, 999)}0${getRandNum(100, 999)} ${getRandNum(10, 99)}`;
      } else {
        result[fN['DCK']] =
          `01123 000${getRandNum(100, 999)}${getRandNum(100, 999)} ${getRandNum(10, 99)}`;
      }
      break;
    case 'NH':
      result[fN['DCK']] = `0${getRandNum(1000, 9999)}${getRandNum(100, 999)}`;
      break;
    default:
      break;
  }
  return result;
}

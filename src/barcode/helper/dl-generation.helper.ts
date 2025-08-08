import {
  dl_NJ,
  evenOrOdd,
  getRandChar,
  getRandNum,
  soundex_FL_IL_WI,
  soundex_MD_MI_MN,
} from 'src/shared/helper/functions.helper';

export async function dlNumberGeneration(
  req: Record<string, string | number>,
): Promise<string> {
  const DAJ: string = req.DAJ as string;
  const { DAC, DAD, DCS, DBB, DBC, DDB, DBD, DAY } = req;
  let MA_chars;
  switch (DAJ) {
    case 'CA':
      return `${getRandChar(1)}` + `${getRandNum(0, 9999999)}`.padStart(7, '0');
    case 'UT':
      return `${getRandNum(1000, 999999999)}`.padStart(9, '0');
    case 'MI':
      let dl = soundex_MD_MI_MN(
        DAC as string,
        DAD as string,
        DCS as string,
        DBB as string,
      );
      return `${dl.slice(0, 1)} ${dl.slice(1)}`;
    case 'IL':
      // TODO ID format check
      return soundex_FL_IL_WI(
        DAC as string,
        DAD as string,
        DCS as string,
        DBB as string,
        DAJ as string,
        DBC as number,
        '-',
      );
    case 'NV':
      return `${getRandNum(1000, 9999999999)}`.padStart(10, '0');
    case 'GA':
      if (DDB == '07012015') {
        return `${getRandNum(10000000, 99999999)}`;
      }
      return `${getRandNum(100000000, 999999999)}`;
    case 'NC':
      return `${getRandNum(100000000000, 999999999999)}`;
    case 'MA':
      MA_chars = Math.floor(Math.random() * 2);
      if (MA_chars) {
        return `SA${getRandNum(1000000, 9999999)}`;
      } else {
        return `S${getRandNum(10000000, 99999999)}`;
      }
    case 'MN':
      return soundex_MD_MI_MN(
        DAC as string,
        DAD as string,
        DCS as string,
        DBB as string,
        '-',
      );
    case 'CT':
      let m =
        +DBB.toString().slice(0, 2) +
        (evenOrOdd(+DBB.toString().slice(6, 8)) ? 0 : 12);
      return `${m.toString().padStart(2, '0')}${getRandNum(1000000, 9999999)}`;
    case 'MO':
      //TODO ID number format
      return `${getRandChar(1)}${getRandNum(100000000, 999999999)}`;
    case 'IA':
      return `${getRandNum(100, 999)}${getRandChar(2)}${getRandNum(1000, 9999)}`;
    case 'MT':
      return `${DBB.toString().slice(0, 2)}${getRandNum(100, 999)}${DBB.toString().slice(4, 8)}41${DBB.toString().slice(2, 4)}`;
    case 'NE':
      return `${['A', 'B', 'C', 'E', 'G', 'H', 'V'][Math.floor(Math.random() * 7)]}${getRandNum(10000000, 99999999)}`;
    case 'RI':
      return `${getRandNum(10000000, 99999999)}`;
    case 'ID':
      return `${getRandChar(2)}${getRandNum(100000, 999999)}${getRandChar(1)}`;
    case 'WV':
      return [
        `${getRandChar(1)}${getRandNum(100000, 999999)}`,
        `${getRandNum(1000000, 9999999)}`,
      ][Math.floor(Math.random() * 2)];
    case 'AZ':
      return `${getRandChar(1)}${getRandNum(10000000, 99999999)}`;
    case 'KS':
      return `K${getRandNum(10, 99)}-${getRandNum(10, 99)}-${getRandNum(1000, 9999)}`;
    case 'PA':
      return `${getRandNum(10, 99)} ${getRandNum(100, 999)} ${getRandNum(100, 999)}`;
    case 'AR':
      // TODO last checksum (9 element)
      return `9${getRandNum(10000000, 99999999)}`;
    case 'FL':
      return `${soundex_FL_IL_WI(DAC as string, DAD as string, DCS as string, DBB as string, DAJ, DBC as number, '-')}`;
    case 'MS':
      return `${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
    case 'ND':
      return `${DCS.toString().slice(0, 3).padEnd(3, 'X')}${DBB.toString().slice(6, 8)}${getRandNum(1000, 9999)}`;
    case 'KY':
      return `${DCS.toString().slice(0, 1)}${DBD.toString().slice(6, 8)}-${getRandNum(100, 999)}-${getRandNum(100, 999)}`;
    case 'TN':
      return `${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
    case 'DE':
      return `${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
    case 'IN':
      return `${getRandNum(1000, 9999)}-${getRandNum(10, 99)}-${getRandNum(1000, 9999)}`;
    case 'WA':
      return `WDL${getRandChar(2)}${getRandNum(100, 999)}${getRandChar(1)}${getRandNum(100, 999)}`;
    case 'SC':
      return `${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
    case 'NJ':
      return `${dl_NJ(DAC as string, DAD as string, DCS as string, DBB as string, DBC as number, DAY as string)}`;
    case 'OR':
      return `${getRandNum(100, 999)}${getRandNum(10, 99)}${getRandNum(10, 99)}`;
    case 'TX':
      if (DDB != '10102016') {
        return `${getRandNum(100, 999)}${getRandNum(100, 999)}${getRandNum(10, 99)}`;
      } else {
        return `${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}`;
      }
    case 'CO':
      return `${getRandNum(10, 99)}-${getRandNum(100, 999)}-${getRandNum(100, 999)}`;
    case 'MD':
      return `${soundex_MD_MI_MN(DAC as string, DAD as string, DCS as string, DBB as string, '-').slice(0, 1)}-${soundex_MD_MI_MN(DAC as string, DAD as string, DCS as string, DBB as string, '-').slice(1)}`;
    case 'WI':
      return `${soundex_FL_IL_WI(DAC as string, DAD as string, DCS as string, DBB as string, DAJ as string, DBC as number, '-')}`;
    case 'LA':
      return `${['00', '01'][getRandNum(0, 1)]}${getRandNum(1000, 9999)}${getRandNum(100, 999)}`;
    case 'AL':
      return `${getRandNum(1000, 9999)}${[getRandNum(1000, 9999), getRandNum(100, 999)][getRandNum(0, 1)]}`;
    case 'VA':
      return `${getRandChar(1)}${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}`;
    case 'OH':
      return `${getRandChar(2)}${getRandNum(100, 999)}${getRandNum(100, 999)}`;
    case 'NM':
      return `${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}${getRandNum(1, 9)}`;
    case 'NY':
      return `${getRandNum(100, 999)} ${getRandNum(100, 999)} ${getRandNum(100, 999)}`;
    case 'NH':
      return `NHL${getRandNum(1000, 9999)}${getRandNum(1000, 9999)}`;
    case 'ON':
      return ``;
    default:
      return '';
  }
}

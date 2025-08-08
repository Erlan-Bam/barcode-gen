import { fN } from 'src/shared/const/fields-names.const';
import { getRandChar, getRandNum } from 'src/shared/helper/functions.helper';

export async function auditInfo(
  req: Record<string, string>,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const DAJ = req.DAJ as string;
  const DBD = req.DBD as string;
  switch (DAJ) {
    case 'WA':
      result[fN['DCJ']] =
        `${DBD.slice(0, 4)}${DBD.slice(6, 8)}${getRandNum(1, 9)}${getRandChar(1)}${getRandNum(1000, 9999)}`;
      break;
    case 'CO':
      result[fN['DCJ']] =
        `${DBD.slice(4, 8)}${DBD.slice(0, 4)}_${getRandNum(10000, 99999)}_${getRandNum(1, 9)}_${getRandNum(1000, 9999)}`;
      break;
  }
  return result;
}

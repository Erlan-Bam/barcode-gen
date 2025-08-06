import {
  calendar,
  choiser,
  input,
  radio,
  select,
} from 'src/shared/helper/fields.helper';
import {
  BarcodePageTopFields,
  BarcodePageTopFieldsArgs,
} from '../dto/configs.dto';
import { ChoiserField, SelectField } from 'src/shared/dto/fields.dto';
import { fN } from 'src/shared/const/fields-names.const';

export const under18 = (DBB: string, DBD: string): string | null => {
  let [month, day, year] = [DBB.slice(0, 2), DBB.slice(2, 4), DBB.slice(4, 8)];
  let currentDate = new Date(
    +DBD.slice(4.8),
    +DBD.slice(0, 2) - 1,
    +DBD.slice(2, 4),
  );
  if (new Date(+year + 18, +month - 1, +day) > currentDate) {
    return `${month}${day}${+year + 18}`;
  } else {
    return null;
  }
};
export const under19 = (DBB: string, DBD: string): string | null => {
  let [month, day, year] = [DBB.slice(0, 2), DBB.slice(2, 4), DBB.slice(4, 8)];
  let currentDate = new Date(
    +DBD.slice(4.8),
    +DBD.slice(0, 2) - 1,
    +DBD.slice(2, 4),
  );
  if (new Date(+year + 19, +month - 1, +day) > currentDate) {
    return `${month}${day}${+year + 19}`;
  } else {
    return null;
  }
};
export const under21 = (DBB: string, DBD: string): string | null => {
  let [month, day, year] = [DBB.slice(0, 2), DBB.slice(2, 4), DBB.slice(4, 8)];
  let currentDate = new Date(
    +DBD.slice(4.8),
    +DBD.slice(0, 2) - 1,
    +DBD.slice(2, 4),
  );
  if (new Date(+year + 21, +month - 1, +day) > currentDate) {
    let dt = `${month}${day}${+year + 21}`;
    if (DBD) return dt === DBD ? null : dt;
    return dt;
  } else {
    return null;
  }
};
export const stringToHex = (str: string) => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i).toString(16);
    hex += `x${charCode.padStart(2, '0').toUpperCase()}`; // Добавляем слэш и два символа
  }
  return hex;
};

export const lbsToDCEConvert = (lbs: string) => {
  if (+lbs <= 70) {
    return 0;
  } else if (+lbs <= 100) {
    return 1;
  } else if (+lbs <= 130) {
    return 2;
  } else if (+lbs <= 160) {
    return 3;
  } else if (+lbs <= 190) {
    return 4;
  } else if (+lbs <= 220) {
    return 5;
  } else if (+lbs <= 250) {
    return 6;
  } else if (+lbs <= 280) {
    return 7;
  } else if (+lbs <= 320) {
    return 8;
  } else {
    return 9;
  }
};
export const CamelCase = (str: string) =>
  str[0].toUpperCase() + str.slice(1).toLowerCase();
export const topFields = ({
  state,
  rev,
  district,
  DAH,
}: BarcodePageTopFieldsArgs): BarcodePageTopFields => {
  return [
    [radio({ t: fN.DBC, a: 'DBC', values: { Man: 1, Woman: 2 } })],
    [
      select({ t: fN.DAJ, a: 'DAJ', values: state, oCS: ['DAJ'] }),
      select({ t: fN.DDB, a: 'DDB', values: rev, oCS: ['DAJ', 'DDB'] }),
    ],
    [
      [
        input({
          t: fN.DAC,
          a: 'DAC',
          p: '([A-Za-z]+)',
          r: true,
          rh: { DBC: ['DAC', 'DAD', 'DCS'] },
        }),
        input({ t: fN.DAD, a: 'DAD', p: '([A-Za-z]+)' }),
        input({ t: fN.DCS, a: 'DCS', p: '([A-Za-z]+)' }),
      ],
      [
        select({
          t: fN.DCU,
          a: 'DCU',
          values: {
            NONE: '',
            Junior: 'JR',
            Senior: 'SR',
            First: '1ST',
            Second: '2ND',
            Third: '3RD',
            Fourth: '4TH',
            Fifth: '5TH',
            Sixth: '6TH',
            Seventh: '7TH',
            Eighth: '8TH',
            Ninth: '9TH',
          },
        }),
        calendar({
          t: fN.DBB,
          a: 'DBB',
          alt: 'Date of Birth',
          r: true,
          rh: { '': ['DBB'] },
        }),
      ],
      district
        ? DAH
          ? [
              district,
              input({
                t: fN.DAG,
                a: 'DAG',
                r: true,
                rh: { DAJ: ['DAG', 'DAI', 'DAK'] },
              }),
              input({ t: fN.DAH, a: 'DAH' }),
              input({ t: fN.DAI, a: 'DAI' }),
              input({ t: fN.DAK, a: 'DAK' }),
            ]
          : [
              district,
              input({
                t: fN.DAG,
                a: 'DAG',
                r: true,
                rh: { DAJ: ['DAG', 'DAI', 'DAK'] },
              }),
              input({ t: fN.DAI, a: 'DAI' }),
              input({ t: fN.DAK, a: 'DAK' }),
            ]
        : DAH
          ? [
              input({
                t: fN.DAG,
                a: 'DAG',
                r: true,
                rh: { DAJ: ['DAG', 'DAI', 'DAK'] },
              }),
              input({ t: fN.DAH, a: 'DAH' }),
              input({ t: fN.DAI, a: 'DAI' }),
              input({ t: fN.DAK, a: 'DAK' }),
            ]
          : [
              input({
                t: fN.DAG,
                a: 'DAG',
                r: true,
                rh: { DAJ: ['DAG', 'DAI', 'DAK'] },
              }),
              input({ t: fN.DAI, a: 'DAI' }),
              input({ t: fN.DAK, a: 'DAK' }),
            ],
    ],
    [
      choiser({
        t: fN.DDA,
        a: 'DDA',
        v: { None: '', 'Real ID': 'F', 'Not for federal': 'N' },
      }),
    ],
  ];
};
export const downChoisers = (): ChoiserField[] => {
  return [
    choiser({
      t: fN.QQQ,
      a: 'QQQ',
      v: {
        DL: 'DL',
        // 'CDL': 'CDL',
        ID: 'ID',
      },
      oCS: ['DAJ', 'DDB', 'QQQ'],
    }),
  ];
};

export const georgiaDistrictSelectField: SelectField = select({
  t: fN.ZGD,
  a: 'ZGD',
  values: {
    '1. Appling': 'APPLING',
    '2. Atkinson': 'ATKINSON',
    '3. Bacon': 'BACON',
    '4. Baker': 'BAKER',
    '5. Baldwin': 'BALDWIN',
    '6. Banks': 'BANKS',
    '7. Barrow': 'BARROW',
    '8. Bartow': 'BARTOW',
    '9. Ben Hill': 'BEN HILL',
    '10. Berrien': 'BERRIEN',
    '11. Bibb': 'BIBB',
    '12. Bleckley': 'BLECKLEY',
    '13. Brantley': 'BRANTLEY',
    '14. Brooks': 'BROOKS',
    '15. Bryan': 'BRYAN',
    '16. Bulloch': 'BULLOCH',
    '17. Burke': 'BURKE',
    '18. Butts': 'BUTTS',
    '19. Calhoun': 'CALHOUN',
    '20. Camden': 'CAMDEN',
    '21. Candler': 'CANDLER',
    '22. Carroll': 'CARROLL',
    '23. Catoosa': 'CATOOSA',
    '24. Charlton': 'CHARLTON',
    '25. Chatham': 'CHATHAM',
    '26. Chattahoochee': 'CHATTAHOOCHEE',
    '27. Chattooga': 'CHATTOOGA',
    '28. Cherokee': 'CHEROKEE',
    '29. Clarke': 'CLARKE',
    '30. Clay': 'CLAY',
    '31. Clayton': 'CLAYTON',
    '32. Clinch': 'CLINCH',
    '33. Cobb': 'COBB',
    '34. Coffee': 'COFFEE',
    '35. Colquitt': 'COLQUITT',
    '36. Columbia': 'COLUMBIA',
    '37. Cook': 'COOK',
    '38. Coweta': 'COWETA',
    '39. Crawford': 'CRAWFORD',
    '40. Crisp': 'CRISP',
    '41. Dade': 'DADE',
    '42. Dawson': 'DAWSON',
    '43. Decatur': 'DECATUR',
    '44. DeKalb': 'DEKALB',
    '45. Dodge': 'DODGE',
    '46. Dooly': 'DOOLY',
    '47. Dougherty': 'DOUGHERTY',
    '48. Douglas': 'DOUGLAS',
    '49. Early': 'EARLY',
    '50. Echols': 'ECHOLS',
    '51. Effingham': 'EFFINGHAM',
    '52. Elbert': 'ELBERT',
    '53. Emanuel': 'EMANUEL',
    '54. Evans': 'EVANS',
    '55. Fannin': 'FANNIN',
    '56. Fayette': 'FAYETTE',
    '57. Floyd': 'FLOYD',
    '58. Forsyth': 'FORSYTH',
    '59. Franklin': 'FRANKLIN',
    '60. Fulton': 'FULTON',
    '61. Gilmer': 'GILMER',
    '62. Glascock': 'GLASCOCK',
    '63. Glynn': 'GLYNN',
    '64. Gordon': 'GORDON',
    '65. Grady': 'GRADY',
    '66. Greene': 'GREENE',
    '67. Gwinnett': 'GWINNETT',
    '68. Habersham': 'HABERSHAM',
    '69. Hall': 'HALL',
    '70. Hancock': 'HANCOCK',
    '71. Haralson': 'HARALSON',
    '72. Harris': 'HARRIS',
    '73. Hart': 'HART',
    '74. Heard': 'HEARD',
    '75. Henry': 'HENRY',
    '76. Houston': 'HOUSTON',
    '77. Irwin': 'IRWIN',
    '78. Jackson': 'JACKSON',
    '79. Jasper': 'JASPER',
    '80. Jeff Davis': 'JEFF DAVIS',
    '81. Jefferson': 'JEFFERSON',
    '82. Jenkins': 'JENKINS',
    '83. Johnson': 'JOHNSON',
    '84. Jones': 'JONES',
    '85. Lamar': 'LAMAR',
    '86. Lanier': 'LANIER',
    '87. Laurens': 'LAURENS',
    '88. Lee': 'LEE',
    '89. Liberty': 'LIBERTY',
    '90. Lincoln': 'LINCOLN',
    '91. Long': 'LONG',
    '92. Lowndes': 'LOWNDES',
    '93. Lumpkin': 'LUMPKIN',
    '94. Macon': 'MACON',
    '95. Madison': 'MADISON',
    '96. Marion': 'MARION',
    '97. McDuffie': 'MCDUFFIE',
    '98. McIntosh': 'MCINTOSH',
    '99. Meriwether': 'MERIWETHER',
    '100. Miller': 'MILLER',
    '101. Mitchell': 'MITCHELL',
    '102. Monroe': 'MONROE',
    '103. Montgomery': 'MONTGOMERY',
    '104. Morgan': 'MORGAN',
    '105. Murray': 'MURRAY',
    '106. Muscogee': 'MUSCOGEE',
    '107. Newton': 'NEWTON',
    '108. Oconee': 'OCONEE',
    '109. Oglethorpe': 'OGLETHORPE',
    '110. Paulding': 'PAULDING',
    '111. Peach': 'PEACH',
    '112. Pickens': 'PICKENS',
    '113. Pierce': 'PIERCE',
    '114. Pike': 'PIKE',
    '115. Polk': 'POLK',
    '116. Pulaski': 'PULASKI',
    '117. Putnam': 'PUTNAM',
    '118. Quitman': 'QUITMAN',
    '119. Rabun': 'RABUN',
    '120. Randolph': 'RANDOLPH',
    '121. Richmond': 'RICHMOND',
    '122. Rockdale': 'ROCKDALE',
    '123. Schley': 'SCHELEY',
    '124. Screven': 'SCREVEN',
    '125. Seminole': 'SEMINOLE',
    '126. Spalding': 'SPALDING',
    '127. Stephens': 'STEPHENS',
    '128. Stewart': 'STEWART',
    '129. Sumter': 'SUMTER',
    '130. Talbot': 'TALBOT',
    '131. Taliaferro': 'TALIAFERRO',
    '132. Tattnall': 'TATTNALL',
    '133. Taylor': 'TAYLOR',
    '134. Telfair': 'TELFAIR',
    '135. Terrell': 'TERRELL',
    '136. Thomas': 'THOMAS',
    '137. Tift': 'TIFT',
    '138. Toombs': 'TOOMBS',
    '139. Towns': 'TOWNS',
    '140. Treutlen': 'TRETLEN',
    '141. Troup': 'TROUP',
    '142. Turner': 'TURNER',
    '143. Twiggs': 'TWIGGS',
    '144. Union': 'UNION',
    '145. Upson': 'UPSON',
    '146. Walker': 'WALKER',
    '147. Walton': 'WALTON',
    '148. Ware': 'WARE',
    '149. Warren': 'WARREN',
    '150. Washington': 'WASHINGTON',
    '151. Wayne': 'WAYNE',
    '152. Webster': 'WEBSTER',
    '153. Wheeler': 'WHEELER',
    '154. White': 'WHITE',
    '155. Whitfield': 'WHITFIELD',
    '156. Wilcox': 'WILCOX',
    '157. Wilkes': 'WILKES',
    '158. Wilkinson': 'WILKINSON',
    '159. Worth': 'WORTH',
  },
});

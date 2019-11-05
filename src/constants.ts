import {Parts} from './@types/index';

const teamColors = [
  '#1B378A', // 1
  '#B6171E', // 2
  '#41B33B', // 3
  '#e162dc', // 4
  '#f76904', // 5
  '#a8f908', // 6
  '#479eef', // 7
  '#F4297D', // 8
  '#1C1A25', // 9
  '#f3f3fd', // 10
  '#9C27B0', // 11
  '#607D8B', // 12
  '#795548', // 13
  '#9E9E9E', // 14
  '#00BCD4'  // 15
];

const parts: Parts = {
  HAND: {
    id: 1,
    korean: '손',
    spells: [
      {
        main: '손펴',
        similar: ['손펴', '손표', '손피라고', '손벽', '손효', '성표', '송평', '손뼉', '송파', '송표', '손뼈', '송편'],
        code: 11,
        speed: 80,
        command: 'motor-6/forward/45'
      },
      {
        main: '잡아',
        similar: ['잡아', '자바', '저봐', '자봐', '차바','잡아라', '자바라', '자막', '참아', '쳐바', '전화', '쳐바', '쳐봐', '봐봐'],
        code: 12,
        speed: 80,
        command: 'motor-6/backward/45'
      },
    ],
    stop: {
      code: 10,
      command: 'motor-6/stop'
    },
  },
  ARM: {
    id: 2,
    korean: '팔',
    spells: [
      {
        main: '팔펴',
        similar: ['팔펴','팔표', '팔피라고', '팔표', '팔벽', '팔효', '팔벼', '발표', '발펴'],
        code: 21,
        speed: 60,
        command: 'motor-5/forward/45'
      },
      {
        main: '접어',
        similar: ['접어', '저붜', '자보', '저봐', '줘봐', '줘바', '접포', '초밥', '여보', '초보', '터보', '초봉', '서버', '더워', '전화'],
        code: 22,
        speed: 60,
        command: 'motor-5/backward/45'
      },
      {
        main: '들어',
        similar: ['들어', '틀어', '드론', '트럭', '불어', '그럼', '뚫어'],
        code: 23,
        speed: 80,
        command: 'motor-2/backward/45'
      },
      {
        main: '내려',
        similar: ['내려', '내려와', '매력', '노력', '매려', '노려', '느려', '재료', '의료'],
        code: 24,
        speed: 60,
        command: 'motor-2/forward/45'
      },
    ],
    stop: {
      code: 20,
      command: 'arm/stop'
    },
  },
  WAIST: {
    id: 3,
    korean: '몸',
    spells: [
      {
        main: '왼쪽',
        similar: ['왼쪽', '외쪽'],
        code: 31,
        speed: 30,
        command: 'motor-1/forward/60'
      },
      {
        main: '오른쪽',
        similar: ['오른쪽', '어른쪽', '어느쪽'],
        code: 32,
        speed: 30,
        command: 'motor-1/backward/60'
      }
    ],
    stop: {
      code: 30,
      command: 'motor-1/stop'
    },
  },
  BOTTOM : {
    id: 4,
    korean: '다리',
    spells: [
      {
        main: '앞으로',
        similar: ['앞으로', '아프로', '아브로', '어그로', '바보'],
        code: 41,
        speed: 60, // 99가 max다 !! 100은 아니되옵니다~
        command: 'bottom/forward/100'
      },
      {
        main: '뒤로',
        similar: ['뒤로', '기록', '귀로', '1호', '위로'],
        code: 42,
        speed: 60,
        command: 'bottom/backward/100'
      },
      {
        main: '왼쪽',
        similar: ['왼쪽'],
        code: 43,
        speed: 40,
        command: 'bottom/left/70'
      },
      {
        main: '오른쪽',
        similar: ['오른쪽', '어른쪽', '어느쪽'],
        code: 44,
        speed: 40,
        command: 'bottom/right/70'
      },
      {
        main: '빠르게',
        similar: ['빠르게', '빠르개', '바르게', '바르개', '파르게', '파르개'],
        code: 45,
        speed: 99,
        command: 'bottom/forward/100'
      },
    ],
    stop: {
      code: 40,
      command: 'bottom/stop'
    },
  }
};

enum Locale {
  en_US = 'en-US',
  ko_KR = 'ko-KR',
  ja_JP = 'ja-JP',
  zh_CN = 'zh-CN',
  zh_HK = 'zh_HK',
  zh = 'zh'
}

const rapiURL = (team: number) => {
  // return `http://localhost:8080/command`;
  return `http://voice-car-0${team}.jp.ngrok.io`;
}
const serverURL = 'http://voice-car.club';
const localURL = 'http://localhost:8080';

enum ROUTES {
  EntranceScreen = "EntranceScreen",
  PartSelectScreen = "PartSelectScreen",
  SpeechScreen = "SpeechScreen",
  RemoteControllerScreen = "RemoteControllerScreen",
  TestScreen = "TestScreen"
}
enum HaxagonViewType {
  Empty = 'empty',
  Text = 'text',
  Image = 'image'
}
enum SpeechSpellMenuItemType {
  Empty = 'empty',
  Text = 'text'
}
enum RemoteBtnType {
  Empty = 'empty',
  Text = 'text',
  PlaceHoldImage = 'placeholdimage'
}

export {
  teamColors,
  parts,
  Locale,
  rapiURL,
  serverURL,
  ROUTES,
  HaxagonViewType,
  RemoteBtnType,
  SpeechSpellMenuItemType
}
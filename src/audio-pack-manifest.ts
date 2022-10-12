import { AudioPack } from "./audio-pack";

function CreateAudioPackCode(id: string) {
    const upperId = id.toUpperCase();
    const lowerId = id.toLowerCase();
    const MakeImport = (file: string) =>
        `import ${upperId}_${file.toUpperCase()} from "./audio-pack/${lowerId}/${file}.json";`;
    const result = [
        MakeImport("config"),
        MakeImport("music"),
        MakeImport("background"),
        "",
        `const ${upperId}_AUDIO_PACK = new AudioPack(${upperId}_CONFIG, ${upperId}_MUSIC, ${upperId}_BACKGROUND);`
    ].join("\n");
    console.log(result);
}

//@ts-ignore
window.CreateAudioPackCode = CreateAudioPackCode;

// ####################
// 샤이니 컬러즈
// ####################

import IMSSC_CONFIG from "./audio-pack/imssc/config.json";
import IMSSC_MUSIC from "./audio-pack/imssc/music.json";
import IMSSC_BACKGROUND from "./audio-pack/imssc/background.json";

const IMSSC_AUDIO_PACK = new AudioPack(IMSSC_CONFIG, IMSSC_MUSIC, IMSSC_BACKGROUND);

// #################### 
// 당기여 시리즈
// ####################

import TSFOX_CONFIG from "./audio-pack/tsfox/config.json";
import TSFOX_MUSIC from "./audio-pack/tsfox/music.json";
import TSFOX_BACKGROUND from "./audio-pack/tsfox/background.json";

const TSFOX_AUDIO_PACK = new AudioPack(TSFOX_CONFIG, TSFOX_MUSIC, TSFOX_BACKGROUND);

// ####################
// OMORI
// ####################

import OMORI_CONFIG from "./audio-pack/omori/config.json";
import OMORI_MUSIC from "./audio-pack/omori/music.json";
import OMORI_BACKGROUND from "./audio-pack/omori/background.json";

const OMORI_AUDIO_PACK = new AudioPack(OMORI_CONFIG, OMORI_MUSIC, OMORI_BACKGROUND);

// ####################
// 스탠리 패러블 시리즈
// ####################

import TSPUD_CONFIG from "./audio-pack/tspud/config.json";
import TSPUD_MUSIC from "./audio-pack/tspud/music.json";
import TSPUD_BACKGROUND from "./audio-pack/tspud/background.json";

const TSPUD_AUDIO_PACK = new AudioPack(TSPUD_CONFIG, TSPUD_MUSIC, TSPUD_BACKGROUND);

// ####################
// 그녀의 세계
// ####################

import TSHER_CONFIG from "./audio-pack/tsher/config.json";
import TSHER_MUSIC from "./audio-pack/tsher/music.json";
import TSHER_BACKGROUND from "./audio-pack/tsher/background.json";

const TSHER_AUDIO_PACK = new AudioPack(TSHER_CONFIG, TSHER_MUSIC, TSHER_BACKGROUND);

// ####################
// 7Beat (TBA)
// ####################

// import SVNBT_CONFIG from "./audio-pack/svnbt/config.json";
// import SVNBT_MUSIC from "./audio-pack/svnbt/music.json";
// import SVNBT_BACKGROUND from "./audio-pack/svnbt/background.json";

// const SVNBT_AUDIO_PACK = new AudioPack(SVNBT_CONFIG, SVNBT_MUSIC, SVNBT_BACKGROUND);

// ####################
// 블루 아카이브 (TBA)
// ####################

// import BLUAC_CONFIG from "./audio-pack/bluac/config.json";
// import BLUAC_MUSIC from "./audio-pack/bluac/music.json";
// import BLUAC_BACKGROUND from "./audio-pack/bluac/background.json";

// const BLUAC_AUDIO_PACK = new AudioPack(BLUAC_CONFIG, BLUAC_MUSIC, BLUAC_BACKGROUND);

// ####################
// 언더테일 (TBA)
// ####################

// import UNTLE_CONFIG from "./audio-pack/untle/config.json";
// import UNTLE_MUSIC from "./audio-pack/untle/music.json";
// import UNTLE_BACKGROUND from "./audio-pack/untle/background.json";

// const UNTLE_AUDIO_PACK = new AudioPack(UNTLE_CONFIG, UNTLE_MUSIC, UNTLE_BACKGROUND);

// ####################
// 델타룬 (TBA)
// ####################

// import DELRN_CONFIG from "./audio-pack/delrn/config.json";
// import DELRN_MUSIC from "./audio-pack/delrn/music.json";
// import DELRN_BACKGROUND from "./audio-pack/delrn/background.json";

// const DELRN_AUDIO_PACK = new AudioPack(DELRN_CONFIG, DELRN_MUSIC, DELRN_BACKGROUND);

// ####################
// 메이플 (TBA)
// ####################

// import MAPLE_CONFIG from "./audio-pack/maple/config.json";
// import MAPLE_MUSIC from "./audio-pack/maple/music.json";
// import MAPLE_BACKGROUND from "./audio-pack/maple/background.json";

// const MAPLE_AUDIO_PACK = new AudioPack(MAPLE_CONFIG, MAPLE_MUSIC, MAPLE_BACKGROUND);

// ####################
//  (TBA)
// ####################


// ####################
//  (TBA)
// ####################


// ####################
//  (TBA)
// ####################


// ####################
//  (TBA)
// ####################



export const AudioPackManifest = {
    [IMSSC_AUDIO_PACK.ID]: IMSSC_AUDIO_PACK,
    [TSFOX_AUDIO_PACK.ID]: TSFOX_AUDIO_PACK,
    [OMORI_AUDIO_PACK.ID]: OMORI_AUDIO_PACK,
    [TSPUD_AUDIO_PACK.ID]: TSPUD_AUDIO_PACK,
    [TSHER_AUDIO_PACK.ID]: TSHER_AUDIO_PACK
};

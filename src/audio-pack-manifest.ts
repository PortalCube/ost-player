import { AudioPack } from "./audio-pack";


// audio pack 만들때 쓰는 코드
// 일반 유저는 사용할 일이 없음
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
// 블루 아카이브
// ####################

import BLUAC_CONFIG from "./audio-pack/bluac/config.json";
import BLUAC_MUSIC from "./audio-pack/bluac/music.json";
import BLUAC_BACKGROUND from "./audio-pack/bluac/background.json";

const BLUAC_AUDIO_PACK = new AudioPack(BLUAC_CONFIG, BLUAC_MUSIC, BLUAC_BACKGROUND);

export const AudioPackManifest = {
    [IMSSC_AUDIO_PACK.ID]: IMSSC_AUDIO_PACK,
    [TSFOX_AUDIO_PACK.ID]: TSFOX_AUDIO_PACK,
    [OMORI_AUDIO_PACK.ID]: OMORI_AUDIO_PACK,
    [TSPUD_AUDIO_PACK.ID]: TSPUD_AUDIO_PACK,
    [TSHER_AUDIO_PACK.ID]: TSHER_AUDIO_PACK,
    [BLUAC_AUDIO_PACK.ID]: BLUAC_AUDIO_PACK
};

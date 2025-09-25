export function randomGif(type) {
  const arr = gifs[type];
  return arr[Math.floor(Math.random() * arr.length)];
}

const gifs = {
  start: ["https://media.tenor.com/k9PP5BZ0_CcAAAAd/chiikawa-jail.gif"],
  correct: [
    "https://media.tenor.com/U7s8InXQnyQAAAAd/ちいかわ-chiikawa.gif",
    "https://media.tenor.com/lt2zYKuEiNAAAAAd/chiikawa-chiikawa-dance.gif",
  ],
  wrong: [
    "https://media.tenor.com/VzO_AzAqboMAAAAd/chikawa-ちいかわ.gif",
    "https://media.tenor.com/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
  ],
  win: [
    "https://media.tenor.com/E0NiMsdDEzcAAAAd/chiikawa-hachiware.gif",
    "https://media.tenor.com/xrSi98HyjLoAAAAd/chiikawa-hachiware.gif",
  ],
  lose: [
    "https://media.tenor.com/duB8JcH5gfcAAAAd/chiikawa-chiikawa-sad.gif",
    "https://media.tenor.com/QM4ZESS5tpUAAAAd/ちいかわ-chiikawa.gif",
  ],
};

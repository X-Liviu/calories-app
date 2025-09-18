const MESSAGE_TO_DECRYPT =
  "RIJ AZKKZHC PIKCE XT ACKCUXJHX SZX, E NZ PEJXKE, PXGIK XFDKXNEQE RIPI RIPQEHCK ET OENRCNPI AXNAX ZJ RKCHXKCI AX CJAXDXJAXJRCE AX RTENX, E ACOXKXJRCE AXT RITEQIKERCIJCNPI OKXJHXDIDZTCNHE AX TE ACKXRRCIJ EJEKSZCNHE. AZKKZHC OZX ZJ OERHIK AX DKCPXK IKAXJ XJ XT DEDXT AX TE RTENX IQKXKE XJ REHETZJVE XJ GZTCI AX 1936. DXKI AZKKZHC, RIPI IRZKKX RIJ TEN DXKNIJETCAEAXN XJ TE MCNHIKCE, JI REVI AXT RCXTI. DXKNIJCOCREQE TE HKEACRCIJ KXvITZRCIJEKCE AX TE RTENX IQKXKE. NZ XJIKPX DIDZTEKCAEA XJHKX TE RTENX HKEQEGEAIKE, KXOTXGEAE XJ XT XJHCXKKI PZTHCHZACJEKCI XJ QEKRXTIJE XT 22 AX JIvCXPQKX AX 1936, PZXNHKE XNE CAXJHCOCRERCIJ. NZ PZXKHX OZX NCJ AZAE ZJ UITDX IQGXHCvI ET DKIRXNI KXvITZRCIJEKCI XJ PEKRME. NCJ AZKKZHC SZXAI PEN TCQKX XT REPCJI DEKE SZX XT XNHETCJCNPI, RIJ TE RIPDTCRCAEA AXT UIQCXKJI AXT OKXJHX DIDZTEK V AX TE ACKXRRCIJ EJEKSZCNHE, HXKPCJEKE XJ PEVI AX 1937 TE HEKXE AX TCSZCAEK TE KXvITZRCIJ, AXNPIKETCLEJAI E TE RTENX IQKXKE V OERCTCHEJAI RIJ XTTI XT DINHXKCIK HKCZJOI OKEJSZCNHE.";

const EXAMPLE = "aa a aaa .";

const KEYS = {
  a: "D",
  b: "V",
  c: "I",
  d: "P",
  e: "A",
  f: "X",
  g: "J",
  h: "T",
  i: "O",
  j: "N",
  k: "R",
  l: "Z",
  m: "H",
  n: "S",
  o: "F",
  p: "M",
  q: "B",
  r: "C",
  s: "Q",
  t: "L",
  u: "G",
  v: "Y",
  w: "W",
  x: "E",
  y: "K",
  z: "U",
};

const decryptMessage = (message) => {
  const letterMap = new Map();
  let totalLetters = 0;

  message = message.toLowerCase();

  for (let letra = "a".charCodeAt(0); letra <= "z".charCodeAt(0); letra++) {
    letterMap.set(String.fromCharCode(letra), 0);
  }

  for (let i = 0; i < message.length; i++) {
    const current = message[i];
    if (current >= "a" && current <= "z") {
      let aux = letterMap.get(current);
      aux++;
      letterMap.set(current, aux);
      totalLetters++;
    }
  }

  for (const key of letterMap.keys()) {
    let aux = letterMap.get(key);
    aux = (aux / totalLetters) * 100;
    letterMap.set(key, aux);
  }

  const sorted = [...letterMap.entries()].sort((a, b) => b[1] - a[1]);

  for (const [key, value] of sorted) {
    console.log(`${key}: ${value.toFixed(2)}%`);
  }

  let decrypted = "";
  for (let i = 0; i < message.length; i++) {
    const current = message[i];
    if (current >= "a" && current <= "z") {
      decrypted += KEYS[current];
    } else decrypted += current;
  }
  console.log(message);
  console.log(decrypted);
};
decryptMessage(MESSAGE_TO_DECRYPT);

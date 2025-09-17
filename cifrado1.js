MESSAGE_TO_DECRYPT =
  "RIJ AZKKZHC PIKCE XT ACKCUXJHX SZX, E NZ PEJXKE, PXGIK XFDKXNEQE RIPI RIPQEHCK ET OENRCNPI AXNAX ZJ RKCHXKCI AX CJAXDXJAXJRCE AX RTENX, E ACOXKXJRCE AXT RITEQIKERCIJCNPI OKXJHXDIDZTCNHE AX TE ACKXRRCIJ EJEKSZCNHE. AZKKZHC OZX ZJ OERHIK AX DKCPXK IKAXJ XJ XT DEDXT AX TE RTENX IQKXKE XJ REHETZJVE XJ GZTCI AX 1936. DXKI AZKKZHC, RIPI IRZKKX RIJ TEN DXKNIJETCAEAXN XJ TE MCNHIKCE, JI REVI AXT RCXTI. DXKNIJCOCREQE TE HKEACRCIJ KXvITZRCIJEKCE AX TE RTENX IQKXKE. NZ XJIKPX DIDZTEKCAEA XJHKX TE RTENX HKEQEGEAIKE, KXOTXGEAE XJ XT XJHCXKKI PZTHCHZACJEKCI XJ QEKRXTIJE XT 22 AX JIvCXPQKX AX 1936, PZXNHKE XNE CAXJHCOCRERCIJ. NZ PZXKHX OZX NCJ AZAE ZJ UITDX IQGXHCvI ET DKIRXNI KXvITZRCIJEKCI XJ PEKRME. NCJ AZKKZHC SZXAI PEN TCQKX XT REPCJI DEKE SZX XT XNHETCJCNPI, RIJ TE RIPDTCRCAEA AXT UIQCXKJI AXT OKXJHX DIDZTEK V AX TE ACKXRRCIJ EJEKSZCNHE, HXKPCJEKE XJ PEVI AX 1937 TE HEKXE AX TCSZCAEK TE KXvITZRCIJ, AXNPIKETCLEJAI E TE RTENX IQKXKE V OERCTCHEJAI RIJ XTTI XT DINHXKCIK HKCZJOI OKEJSZCNHE.";
const frecuenciasInvertidas = {
  16.78: "e",
  11.96: "a",
  8.69: "o",
  8.37: "l",
  7.88: "s",
  7.01: "n",
  6.87: "d",
  4.94: "r",
  4.8: "u",
  4.15: "i",
  3.31: "t",
  2.92: "c",
  2.776: "p",
  2.12: "m",
  1.54: "y",
  1.53: "q",
  0.92: "b",
  0.89: "h",
  0.73: "g",
  0.52: "f",
  0.39: "v",
  0.3: "j",
  0.29: "ñ",
  0.15: "z",
  0.06: "x",
  0.0: "k",
  0.0: "w",
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
    if (current.charCodeAt(0) >= 97 && current.charCodeAt(0) <= 122) {
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

  for (const key of letterMap.keys()) {
    console.log(`${key}: ${letterMap.get(key)}`);
  }
};
decryptMessage(MESSAGE_TO_DECRYPT);

//PREGUNTAR SI ES SOBRE EL TOTAL DEL MENSAJE

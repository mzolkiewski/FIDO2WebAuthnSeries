'use strict';

var bufferToString = (buff) => {
    var enc = new TextEncoder(); // always utf-8
    return enc.decode(buff)
}

// https://gist.github.com/herrjemand/dbeb2c2b76362052e5268224660b6fbc
var parseAuthData = (buffer) => {
    let rpIdHash      = buffer.slice(0, 32);            buffer = buffer.slice(32);
    let flagsBuf      = buffer.slice(0, 1);             buffer = buffer.slice(1);
    let flagsInt      = flagsBuf[0];
    let flags = {
        up: !!(flagsInt & 0x01),
        uv: !!(flagsInt & 0x04),
        at: !!(flagsInt & 0x40),
        ed: !!(flagsInt & 0x80),
        flagsInt
    }

    let counterBuf    = buffer.slice(0, 4);             buffer = buffer.slice(4);
    let counter       = counterBuf.readUInt32BE(0);

    let aaguid        = undefined;
    let credID        = undefined;
    let COSEPublicKey = undefined;

    if(flags.at) {
        aaguid           = buffer.slice(0, 16);          buffer = buffer.slice(16);
        let credIDLenBuf = buffer.slice(0, 2);           buffer = buffer.slice(2);
        let credIDLen    = credIDLenBuf.readUInt16BE(0);
        credID           = buffer.slice(0, credIDLen);   buffer = buffer.slice(credIDLen);
        COSEPublicKey    = buffer;
    }

    return {rpIdHash, flagsBuf, flags, counter, counterBuf, aaguid, credID, COSEPublicKey}
}
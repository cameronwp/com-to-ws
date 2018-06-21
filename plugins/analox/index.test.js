const analox = require('./index');

describe('#getLines', () => {
  test('drops empty strings', () => {
    const msg = `>14-JUN-2018 22:15:00${String.fromCharCode(13)}`;
    const input = Buffer.from(msg);
    expect(analox.getLines(input).length).toEqual(1);
  });

  test('drops CRs', () => {
    const msg = `>14-JUN-2018 22:15:00${String.fromCharCode(13)}`;
    const input = Buffer.from(msg);
    expect(analox.getLines(input)[0]).toEqual(msg.substring(0, msg.length - 1));
  });
});

describe('#checksum', () => {
  test('it creates an accurate 4-digit, hex checksum', () => {
    const msg = '>14-JUN-2018 22:15:00, pO2=4.56';
    expect(analox.checksum(msg)).toEqual('06ba');
  });
});

describe('#validate', () => {
  test("it returns false if a checksum doesn't match", () => {
    //
  });
});

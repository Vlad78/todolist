import { CustomPromise } from "./CustomPromise";

const sleepRes = (ms: number) => {
  return new CustomPromise((res, rej) => {
    setTimeout(() => res("Slept " + ms.toString() + " ms"), ms);
  });
};
const sleepRej = (ms: number) => {
  return new CustomPromise((res, rej) => {
    setTimeout(() => rej("Slept " + ms.toString() + " ms"), ms);
  });
};

describe("test custom promise", () => {
  const initValue = "CustomPromise";

  it("async resolve, chaining, promise in promise", () => {
    expect.assertions(1);
    return expect(
      sleepRes(3)
        .then((res) => {
          console.log(res);
          return res + " first return";
        })
        .then((res) => {
          console.log(res);
          return new CustomPromise((resolve, reject) => {
            resolve(res + " promise");
          });
        })
        .then((res) => {
          console.log(res);
          return res + " then2";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch2";
        })
        .then((res) => {
          console.log(res);
          return res + " then3";
        })
        .then((res) => {
          console.log(res);
        })
    ).resolves.toBeDefined();
  });

  it("async resolve, chaining", () => {
    expect.assertions(1);
    return expect(
      sleepRes(3)
        .catch((res) => {
          console.log(res);
          return res + " catch";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch2";
        })
        .then((res) => {
          console.log(res);
          return res + " then3";
        })
        .then((res) => {
          console.log(res);
        })
    ).resolves.toBeDefined();
  });

  it("async resolve, chaining", () => {
    expect.assertions(1);
    return expect(
      sleepRej(3)
        .then((res) => {
          console.log(res);
          return res + " first return";
        })
        .then((res) => {
          console.log(res);
          return new CustomPromise((resolve, reject) => {
            resolve(res + " promise");
          });
        })
        .then((res) => {
          console.log(res);
          return res + " then2";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch2";
        })
        .then((res) => {
          console.log(res);
          return res + " then3";
        })
        .then((res) => {
          console.log(res);
        })
    ).resolves.toBeDefined();
  });

  it("async resolve, chaining", () => {
    expect.assertions(1);
    return expect(
      sleepRej(3000)
        .catch((res) => {
          console.log(res);
          return res + " catch";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch2";
        })
        .then((res) => {
          console.log(res);
          return res + " then3";
        })
        .then((res) => {
          console.log(res);
        })
        .catch((res) => {
          console.log(res);
          return res + " catch3";
        })
    ).resolves.toBeDefined();
  });

  it("sync resolve, chaining", () => {
    expect(
      new CustomPromise<typeof initValue>((resolve, rej) => {
        resolve(initValue);
      })
        .then((res) => {
          console.log(res);
          return res + " then1";
        })
        .then((res) => {
          console.log(res);
          return res + " then2";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch2";
        })
    ).resolves.toBeDefined();
  });

  it("sync resolve, chaining", () => {
    expect(
      new CustomPromise((resolve, rej) => {
        resolve("resolve");
      })
        .catch((res) => {
          console.log(res);
          return res + " catch";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch2";
        })
        .then((res) => {
          console.log(res);
          return res + " then1";
        })
        .then((res) => {
          console.log(res);
          return res + " then2";
        })
    ).resolves.toBeDefined();
  });

  it("sync reject, chaining", () => {
    expect(
      new CustomPromise((resolve, rej) => {
        rej("reject");
      })
        .then((res) => {
          console.log(res);
          return res + " then1";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch2";
        })
        .then((res) => {
          console.log(res);
          return res + " then2";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch3";
        })
        .then((res) => {
          console.log(res);
          return res + " then3";
        })
    ).resolves.toBeDefined();
  });

  it("sync reject, chaining", () => {
    expect(
      new CustomPromise((resolve, rej) => {
        rej("reject");
      })
        .catch((res) => {
          console.log(res);
          return res + " catch";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch2";
        })
        .then((res) => {
          console.log(res);
          return res + " then2";
        })
        .catch((res) => {
          console.log(res);
          return res + " catch3";
        })
        .then((res) => {
          console.log(res);
          return res + " then3";
        })
    ).resolves.toBeDefined();
  });
  it("sync finally, chaining", () => {
    expect(
      new CustomPromise((resolve, reject) => resolve("response"))
        .finally(() => {
          return "finally";
        })
        .finally()
        .then((res) => console.log(res))
    ).resolves.toBeDefined();
  });
  // it("async resolve, chaining", () => {
  //   expect.assertions(1);
  //   return expect().resolves.toBeDefined();
  // });
});

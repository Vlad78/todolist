type Initializer<T> = (resolve: Resolve<T>, reject: Reject) => void;
type AnyFunction = (...args: any[]) => any;
type Resolve<T> = (value: T) => any;
type Reject = (reason?: any) => any;
type Finally = () => void;
type Status = "fulfilled" | "rejected" | "pending";

export class CustomPromise<T> {
  private thenAndResolve: [AnyFunction | null, Resolve<T>?] = [null];
  private catchAndReject: [AnyFunction | null, Reject?] = [null];
  private status: Status = "pending";
  private value: T | null = null;
  private reason: any = null;

  // static a() {
  //   console.log(1);
  // }

  constructor(executor: Initializer<T>) {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    executor(this.resolve, this.reject);
  }

  then(thenCallback: Resolve<T>) {
    return new CustomPromise<T>((res, rej) => {
      if (!!this.value) {
        const callbackReturn = thenCallback(this.value);
        res(callbackReturn);
      }
      if (!!this.reason) {
        rej(this.reason);
      }
      this.thenAndResolve = [thenCallback, res];
      this.catchAndReject = [null, rej];
    });
  }
  catch(catchCallback: Reject) {
    return new CustomPromise((res, rej) => {
      if (!!this.reason) {
        const callbackReturn = catchCallback(this.reason);
        res(callbackReturn);
      }
      if (!!this.value) {
        res(this.value);
      }
      this.catchAndReject = [catchCallback, rej];
      this.thenAndResolve = [null, res];
    });
  }
  finally(finallyCallback?: Finally) {
    finallyCallback?.();
    return this;
  }

  private resolve(value: T) {
    this.value = this.unpromise(value);
    this.status = "fulfilled";
    const [thenCallback, nextResolve] = this.thenAndResolve;
    const callbackReturn = thenCallback?.(this.value);
    nextResolve?.(callbackReturn || this.value);
  }

  private reject(reason?: any) {
    this.reason = this.unpromise(reason);
    this.status = "rejected";
    const [catchCallback, nextReject] = this.catchAndReject;

    if (catchCallback) {
      const value = catchCallback(this.reason);
      const [thenCallback, nextResolve] = this.thenAndResolve;
      nextResolve?.(value);
    } else {
      nextReject?.(this.reason);
    }
  }

  private unpromise = (value: T | any) => {
    if (value instanceof CustomPromise) {
      const result = value.then((res) => {
        return res;
      });
      return result.value;
    }
    return value;
  };
}

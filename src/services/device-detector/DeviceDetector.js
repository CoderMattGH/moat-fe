export class DeviceDetector {
  constructor() {
    throw new Error("DeviceDetector cannot be initialised!");
  }

  static isMobileDevice = () => {
    let pattern = /iPad|iPhone|iPod|Mobile Safari/;
    let userAgent = navigator.userAgent;

    if (pattern.test(userAgent)) {
      return true;
    } else {
      return false;
    }
  };
}

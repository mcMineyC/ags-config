import kdeConnect from "./kdeconnect_dbus.js";
import GLib from "gi://GLib";
import GObject from 'gi://GObject';

class KdeConnectServiceSingleton extends Service{
  static {
    Service.register(this,
      {
        'deviceListChanged': ["jsobject"],
        'batteryRefreshed': ["jsobject"],
      },
      {
        'devices': ["string", "r"],
        'deviceCount': ["int", "r"],
        'deviceBattery': ["int", "r"],
        'deviceCharging': ["boolean", "r"],
      },
    );
  }
  #proxy = kdeConnect.mainProxy;
  #deviceBatteryProxy = null;
  #devices = [];
  #deviceCount = -1;
  #deviceBattery = -1;
  #deviceCharging = false;
  get proxy() {
    return this.#proxy
  }
  get devices() {
    return this.#devices;
  }
  get deviceCount() {
    console.log("Device count: ", this.#devices.length)
    this.#deviceCount = this.#devices.length;
    return this.#deviceCount;
  }
  get deviceBattery() {
    console.log("Device battery: ", this.#deviceBattery)
    if(this.#deviceBattery == -1) this.#updateBattery();
    return this.#deviceBattery;
  }
  get deviceCharging() {
    console.log("Device charging: ", this.#deviceCharging)
    if(this.#deviceBattery == -1) this.#updateBattery();
    return this.#deviceCharging;
  }

  constructor(){
    super();
    this.#devices = this.#getConnectedDevices();
    this.#proxy.connectSignal("deviceListChanged", (proxy) => {
      console.log("Device list changed");
      this.#devices = this.#getConnectedDevices();
      this.#deviceCount = this.#devices.length;
      this.emit("deviceListChanged", this.#devices);
      this.emit("changed");
      this.#updateBattery();
    })
  }
  #getConnectedDevices(){
    var devicesReturnValue = this.#proxy.call_sync(
      'devices',
      new GLib.Variant('(b)', [true, true]),
      0,
      -1,
      null,
    );
    var result = devicesReturnValue.deepUnpack()[0];
    return result;
  }
  #updateBattery(){
    if(this.#devices.length > 0){
      console.log("Updating battery");
      if(this.#deviceBatteryProxy == null){
        console.log("Creating battery proxy");
        this.#deviceBatteryProxy = kdeConnect.createProxy("/modules/kdeconnect/devices/" + this.#devices[0] + "/battery", "device_battery");
        this.#deviceBatteryProxy.connectSignal("refreshed", (_proxy, _sender, data) => {
          this.#deviceBattery = data[1];
          this.#deviceCharging = data[0];
          console.log("Battery refreshed");
          this.emit("batteryRefreshed", {charging: this.#deviceCharging, percent: this.#deviceBattery});
          this.emit("changed");
        })
      }
      this.#deviceCharging = this.#deviceBatteryProxy.isCharging;
      this.#deviceBattery = this.#deviceBatteryProxy.charge;
      this.emit("changed");
      this.emit("batteryRefreshed", {charging: this.#deviceCharging, percent: this.#deviceBattery});
      console.log({charging: this.#deviceCharging, percent: this.#deviceBattery})
    }
  }
}
const KdeConnectService = new KdeConnectServiceSingleton;
export default KdeConnectService;

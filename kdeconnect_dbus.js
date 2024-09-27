import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const modules_kdeconnect_introspection = Utils.readFile(`${App.configDir}/introspections/modules_kdeconnect.xml`)

const KdeConnectProxy = Gio.DBusProxy.makeProxyWrapper(modules_kdeconnect_introspection);

let proxy = null;

try {
  proxy = new KdeConnectProxy(Gio.DBus.session, "org.kde.kdeconnect", "/modules/kdeconnect");
} catch (e) {
    console.warn(e);
}
console.log("Got proxy")
//proxy.connect('g-signal', function(_proxy, senderName, signalName, parameters) {
//  console.log("Got g-signal", signalName, parameters);
//});
//proxy.connect('g-properties-changed', function(_proxy, interfaceName, changedProperties) {
//  console.log("Got g-properties-changed", interfaceName, changedProperties);
//  const properties = changedProperties.deepUnpack();
//  for (const [key, value] of Object.entries(properties)) {
//    console.log("Got property changed", key, value);
//  }
//});
//proxy.call(
//  'devices',
//  new GLib.Variant('(b)', [true, true]),
//  0,
//  null,
//  null,
//  (proxy, returnValue) => {
//    var result = proxy.call_finish(returnValue).deepUnpack()[0];
//    console.log("Got result", result);
//  },
//);
function createProxy(path, introspectionName){
  console.log("Creating proxy for", path, "using introspection", `${App.configDir}/introspections/${introspectionName}.xml`);
  var introspection = Utils.readFile(`${App.configDir}/introspections/${introspectionName}.xml`)
  var introspectionProxy = Gio.DBusProxy.makeProxyWrapper(introspection);
  return introspectionProxy(Gio.DBus.session, "org.kde.kdeconnect", path);
}
export default {
  mainProxy: proxy,
  createProxy: createProxy,
};

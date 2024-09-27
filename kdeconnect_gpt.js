const { Gio, GLib } = imports.gi;

// Connect to the session bus
const bus = Gio.bus_get_sync(Gio.BusType.SESSION, null);
const objectPath = '/modules/kdeconnect';
const interfaceName = 'org.kde.kdeconnect.daemon';

// Create a D-Bus proxy for the specified object and interface
const proxy = new Gio.DBusProxy({
    name: 'org.kde.kdeconnect',
    object_path: objectPath,
    interface_name: interfaceName,
});

// Connect to the 'deviceListChanged' signal
proxy.connect('deviceListChanged', (proxy, signal_name) => {
    print('Device list has changed.');
});

// Optional: You can also connect to other signals if needed
proxy.connect('deviceAdded', (proxy, signal_name, id) => {
    print('Device added:', id);
});

proxy.connect('deviceRemoved', (proxy, signal_name, id) => {
    print('Device removed:', id);
});
export default proxy;

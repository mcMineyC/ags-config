export const ClockWidget = (clockVar) => Widget.Label().hook(clockVar, self => {
  var clock = clockVar.value;
  var minutes = clock.getMinutes();
  var hours = clock.getHours() > 12 ? clock.getHours() - 12 : clock.getHours();
  var apm = clock.getHours() >= 12 ? "pm" : "am";
  self.label = `${hours}:${minutes.toString().padStart(2, "0")} ${apm}`;
})

export const KdeConnectDevicesWidget = (KdeConnectService) => 
  Widget.Label({
    label: KdeConnectService.bind('devices').as(d => d.length.toString() + " device"+(d.length == 1 ? "" : "s")),
    setup: self => self.hook(KdeConnectService, (self, result) => {
      console.log("Hook called")
      if(result == undefined){
        result = [];
      }
      self.label = `${result.length} device${result.length == 1 ? "" : "s"}`;
    }, 'deviceListChanged'),
  })

export const BatteryWidget = (batteryVar, KdeConnectService) => 
  Widget.Box({
    className: "battery-box",
    children: [
      Widget.Box({
        className: "battery-device-box",
        children: [
          Widget.Label({
            className: KdeConnectService.bind("deviceCharging").as(c => c ? "battery-charging" : ""),
            label: KdeConnectService.bind("deviceBattery").as(d => d.toString() + "%"),
            visible: KdeConnectService.bind("devices").as(d => d.length > 0),
            setup: self => self.hook(KdeConnectService, (_, data)=>{
              if(data == undefined) return
              self.label = `${data.percent}%`;
              self.class_name = data.charging ? "battery-charging" : "";
            }, "batteryRefreshed"),
          }),
          Widget.Icon({
            className: KdeConnectService.bind("deviceCharging").as(c => c ? "battery-charging" : ""),
            icon: "phone-symbolic",
            setup: self => self.hook(KdeConnectService, (_, data)=>{
              if(data == undefined) return
              self.class_name = data.charging ? "battery-charging" : "";
            }, "batteryRefreshed"),
          })
        ]
      }),
      Widget.Box({
        className: "battery-this-box",
        children: [
          Widget.Label({
            label: batteryVar.bind("percent").as(c => `${Math.round(c)}%`),
            visible: batteryVar.bind("available"),
            className: batteryVar.bind("charging").as(c => c ? "battery-charging" : "")
          }),
          Widget.Icon({
            className: batteryVar.bind("charging").as(c => c ? "battery-charging" : ""),
            icon: "computer-symbolic",
          })
        ]
      }),

      
    ]
  })
  

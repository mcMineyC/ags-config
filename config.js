import { CornerTL, CornerTR, CornerBR, CornerBL} from "./rounded_corners.js";
const battery = await Service.import("battery");

const clockVar = Variable(new Date(), {
  poll: [30000, () => {
    return new Date();
  }]
})
var battNotifStatus = {cr1t1cal: false, ultraLow: false, low: false}
battery.connect("changed", (val) => {
  if(val.charging) return;
  if(Math.round(val.percent) <= 30 && !battNotifStatus.low){
    Utils.exec(`notify-send "Low battery" "THE BATTERY IS LOW"`)
    battNotifStatus.low = true;
  }else if(Math.round(val.percent) <= 20 && !battNotifStatus.ultraLow){
    Utils.exec(`notify-send "Ultra low battery" "THE BATTERY IS ULTRA LOW"`)
    battNotifStatus.ultraLow = true;
  }else if (Math.round(val.percent) <= 10 && !battNotifStatus.cr1t1cal){
    Utils.exec(`notify-send "CR1T1CALLY low battery" "THE BATTERY IS CR1T1CALLY LOW"`)
    battNotifStatus.cr1t1cal = true;
  }
})

const bar = Widget.Window({
  "class-name": "bar",
  name: `bar`,
  anchor: ['top', 'left', 'right'],
  exclusivity: 'exclusive',
  //margins: [6, 6, 0, 6],
  child: Widget.CenterBox({
    startWidget: Widget.Box({
      hpack: "start",
      className: "bar-left",
      children: [
        Widget.Button({
          className: "applebutton",
          onClicked: () => {
            console.log("Apple clicked")
          },
          child: Widget.Icon({
            className: "bar-left-logo",
            icon: `${App.configDir}/apple_logo_white.png`,
            size: 10,
          })
        })
      ]
    }),
    centerWidget: Widget.Box({
      children: [
        //RoundedCorner("topright", {className: "bar-center-corner"}),
        Widget.CenterBox({
          hexpand: false,
          vexpand: true,
          className: "bar-center",
          //child: Widget.Label({
            //label: "Hi, it is [Object object] o'clock"
          //}),
          centerWidget: Widget.Label().hook(clockVar, self => {
            var clock = clockVar.value;
            var minutes = clock.getMinutes();
            var hours = clock.getHours() > 12 ? clock.getHours() - 12 : clock.getHours();
            var apm = clock.getHours() >= 12 ? "pm" : "am";
            self.label = `${hours}:${minutes.toString().padStart(2, "0")} ${apm}`;
          })
        }),
        //RoundedCorner("topleft", {className: "bar-center-corner"}),
      ]
  }),
    endWidget: Widget.Box({
      hpack: "end",
      className: "bar-right",
      children: [
        Widget.Label({
          className: battery.bind("charging").as(c => c ? "battery-charging" : "")
        }).hook(battery, self => {
          self.label = `${Math.round(battery.percent)}%`
          self.visible = battery.available
        }, "changed")
      ]
    }),
  }),
  //child: Widget.CenterBox({
      //start_widget: Widget.Label({
      //    hpack: 'center',
      //    label: 'Welcome to AGS!',
      //}),
      //end_widget: Widget.Label({
      //    hpack: 'center',
      //    label: time.bind(),
      //}),
  //}),
})

const deskClock = Widget.Window({
  name: "desk-clock",
  anchor: ["top", "left"],
  margins: [24, 0, 0, 24],
  layer: "background",
  child: Widget.Box({
    "class-name": "background-tile",
    vertical: true,
    children: [
      Widget.Label({
        "class-name": "deskclock-text deskclock-text-top",
        //label: "02",
      }).hook(clockVar, self => {
        var hours = clockVar.value.getHours();
        self.label = (hours > 12 ? hours-12 : hours).toString().padStart(2, "0")
      }),
      Widget.Label({
        "class-name": "deskclock-text deskclock-text-bottom",
        //label: "39",
      }).hook(clockVar, self => {
        var minutes = clockVar.value.getMinutes();
        self.label = minutes.toString().padStart(2, "0")
      }),
    ]
  }),
})

// main scss file
const scss = `${App.configDir}/scss/style.scss`

// target css file
const css = `/tmp/style.css`

// make sure sassc is installed on your system
Utils.exec(`sassc ${scss} ${css}`)

App.config({
    style: css,
    windows: [
      CornerTL,
      CornerTR,
      CornerBR,
      CornerBL,
      bar,
      deskClock,
    ],
})

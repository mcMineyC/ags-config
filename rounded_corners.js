import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { enableClickthrough } from "./clickthrough.js";
const { Gtk } = imports.gi;
const Lang = imports.lang;

export const RoundedCorner = (place, props) => Widget.DrawingArea({
    ...props,
    hpack: place.includes('left') ? 'start' : 'end',
    vpack: place.includes('top') ? 'start' : 'end',
    setup: (widget) => Utils.timeout(1, () => {
        const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
        const r = widget.get_style_context().get_property('border-radius', Gtk.StateFlags.NORMAL);
        widget.set_size_request(r, r);
        widget.connect('draw', Lang.bind(widget, (widget, cr) => {
            const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
            const r = widget.get_style_context().get_property('border-radius', Gtk.StateFlags.NORMAL);
            // const borderColor = widget.get_style_context().get_property('color', Gtk.StateFlags.NORMAL);
            // const borderWidth = widget.get_style_context().get_border(Gtk.StateFlags.NORMAL).left; // ur going to write border-width: something anyway
            widget.set_size_request(r, r);

            switch (place) {
                case 'topleft':
                    cr.arc(r, r, r, Math.PI, 3 * Math.PI / 2);
                    cr.lineTo(0, 0);
                    break;

                case 'topright':
                    cr.arc(0, r, r, 3 * Math.PI / 2, 2 * Math.PI);
                    cr.lineTo(r, 0);
                    break;

                case 'bottomleft':
                    cr.arc(r, 0, r, Math.PI / 2, Math.PI);
                    cr.lineTo(0, r);
                    break;

                case 'bottomright':
                    cr.arc(0, 0, r, 0, Math.PI / 2);
                    cr.lineTo(r, r);
                    break;
              default:
                console.log("Invalid position: ", place);
                break;
            }

            cr.closePath();
            cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
            cr.fill();
            //cr.clip();
            // cr.setLineWidth(borderWidth);
            // cr.setSourceRGBA(borderColor.red, borderColor.green, borderColor.blue, borderColor.alpha);
            // cr.stroke();
        }));
    }),
});
export const CornerTL = Widget.Window({
  name: "corner-tl",
  anchor: ["top", "left"],
  layer: "overlay",
  exclusivity: "ignore",
  visible: true,
  child: RoundedCorner("topleft", {className: 'corner'}),
  setup: enableClickthrough
})
export const CornerTR = Widget.Window({
  name: "corner-tr",
  anchor: ["top", "right"],
  layer: "overlay",
  exclusivity: "ignore",
  visible: true,
  child: RoundedCorner("topright", {className: 'corner'}),
  setup: enableClickthrough
})
export const CornerBR = Widget.Window({
  name: "corner-br",
  anchor: ["bottom", "right"],
  layer: "overlay",
  exclusivity: "ignore",
  visible: true,
  child: RoundedCorner("bottomright", {className: 'corner'}),
  setup: enableClickthrough
})
export const CornerBL = Widget.Window({
  name: "corner-bl",
  anchor: ["bottom", "left"],
  layer: "overlay",
  exclusivity: "ignore",
  visible: true,
  child: RoundedCorner("bottomleft", {className: 'corner'}),
  setup: enableClickthrough
})

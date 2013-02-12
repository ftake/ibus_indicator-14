const Main = imports.ui.main
const Shell = imports.gi.Shell
const Panel = imports.ui.panel
const Lang = imports.lang
const PanelMenu = imports.ui.panelMenu
const IBus = imports.gi.IBus

const AddIndicator = new Lang.Class({
    Name: 'AddIndicator',
    _init: function() {
	Main.notificationDaemon._trayManager.connect('tray-icon-added', Lang.bind(this, this._onTrayIconAdded))
	Main.notificationDaemon._trayManager.connect('tray-icon-removed', Lang.bind(this, this._onTrayIconRemoved))
    },

    _onTrayIconAdded: function(manager, actor) {
	if (actor.wm_class == 'ibus-ui-gtk') {
	    if (!('new_async' in IBus.Bus)) {
		// This IBus does not support GNOME 3.6
		actor.height = Panel.PANEL_ICON_SIZE
		this.button = new PanelMenu.Button()
		this.button.actor.add_actor(actor)
		Main.panel.addToStatusArea('ibus-gtk-ui', this.button, 0, 'right')
	    }
	}
    },

    _onTrayIconRemoved: function(manager, actor) {
	if (actor.wm_class == 'ibus-ui-gtk') {
	    this.button.destroy()
	}	
    }
})

function init() {
    new AddIndicator()
}

function enable() {

}

function disable() {

}

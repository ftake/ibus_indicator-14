const Main = imports.ui.main
const Shell = imports.gi.Shell
const Panel = imports.ui.panel
const Lang = imports.lang
const PanelMenu = imports.ui.panelMenu
const NotificationDaemon = imports.ui.notificationDaemon;

let addIndicator = null

const AddIndicator = new Lang.Class({
    Name: 'AddIndicator',

    _init: function() {
	Main.notificationDaemon._trayManager.connect('tray-icon-added', Lang.bind(this, this._onTrayIconAdded))
	Main.notificationDaemon._trayManager.connect('tray-icon-removed', Lang.bind(this, this._onTrayIconRemoved))
	Panel.PANEL_ITEM_IMPLEMENTATIONS['ibus-ui-gtk-14'] = null;
    },

    _onTrayIconAdded: function(manager, actor) {
	if (actor.wm_class == 'ibus-ui-gtk-14') {
	    // for patched IBus 1.4
	    this._icon = actor;
	    this._addIBusIndicator();
	} else if (actor.wm_class == 'ibus-ui-gtk') {
	    try {
		var IBus = imports.gi.IBus
		if (!('new_async' in IBus.Bus)) {
		    // This IBus does not support GNOME 3.6
		    this._icon = actor;
		    this._addIBusIndicator();
		}
	    } catch (e) {
		IBus = null
		log(e)
	    }
	}
    },

    _addIBusIndicator: function() {
	if (this._enabled && this._icon) {
	    this._removeFromNotificationDaemon();
	    this._icon.height = Panel.PANEL_ICON_SIZE
	    this._icon.queue_redraw()
	    this._indicator = new PanelMenu.Button()
	    this._indicator.actor.add_actor(this._icon)
	    Main.panel.addToStatusArea('ibus-ui-gtk-14', this._indicator, 0, 'right')
	    NotificationDaemon.STANDARD_TRAY_ICON_IMPLEMENTATIONS['ibus-ui-gtk-14'] = 'keyboard'
	}
    },

    _removeIBusIndicator: function() {
	if (this._indicator) {
	    this._indicator.actor.remove_actor(this._icon);
//	    this._icon.unparent();
	    this._indicator.destroy();
	    this._indicator = null;
	}
    },

    _onTrayIconRemoved: function(manager, actor) {
	if (actor.wm_class == 'ibus-ui-gtk-14' || actor.wm_class == 'ibus-ui-gtk') {
	    this._removeIBusIndicator();
	    this._icon = null;
	}	
    },

    _removeFromNotificationDaemon: function() {
	if (this._icon) {
	    let source = Main.notificationDaemon._lookupSource(null, this._icon.pid, true);
	    if (source) {
		this._icon.get_parent().remove_actor(this._icon)
//		this._icon.unparent()
		source.destroy();
	    }
	}
    },

    _enabled: false,
    enable: function() {
	this._enabled = true;
	this._addIBusIndicator();
    },

    disable: function() {
	this._enabled = false;
	this._removeIBusIndicator();
	NotificationDaemon.STANDARD_TRAY_ICON_IMPLEMENTATIONS['ibus-ui-gtk-14'] = undefined;
	if (this._icon) {
	    //Main.notificationDaemon._onTrayIconAdded(null, this._icon);
	    Main.notificationDaemon._getSource(
	     	this._icon.title || this._icon.wm_class || C_("program", "Unknown"),
	     	this._icon.pid, null, null, this._icon);
	}
    }
})

function init() {
    addIndicator = new AddIndicator();
}

function enable() {
    addIndicator.enable();
}

function disable() {
    addIndicator.disable();
}

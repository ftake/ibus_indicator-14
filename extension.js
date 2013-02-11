const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Panel = imports.ui.panel;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;

const AddIndicator = new Lang.Class({
    Name: 'AddIndicator',
    _init: function() {
	this._trayManager = new Shell.TrayManager()
	this._trayManager.connect('tray-icon-added', Lang.bind(this, this._onTrayIconAdded))
	this._trayManager.manage_stage(global.stage, Main.messageTray.actor);
    },

    _onTrayIconAdded: function(manager, actor) {
	if (actor.wm_class == 'ibus-ui-gtk-14') {
	    let button = new PanelMenu.Button();
            button.actor.add_actor(actor);
	    Main.panel.addToStatusArea('ibus-gtk-ui-14', button, 0, 'right')
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

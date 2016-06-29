var
async	= require('async'),
xml2js  = require('xml2js'),
path 	= require('path'),
fs      = require('fs-extra');

function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return path;
}
function writeRoxTermProfile(lines){
	var data=
		"[roxterm profile]\n"+
		"height=40\n"+
		"maximise=1\n"+
		"always_show_tabs=1\n"+
		"show_add_tab_btn=1\n"+
		"hide_menubar=0\n"+
		"saturation=0.764526\n"+
		"colour_scheme=Default\n"+
		"scroll_on_output=1\n"+
		"scroll_on_keystroke=1\n"+
		"use_custom_command=1\n"+
		"exit_action=1\n"+
		"command="+lines.custom_command.replace(/\"/g,'\"')+"\n"+
		"tab_pos=2\n";
	fs.writeFileSync(resolveHome('~/.config/roxterm.sourceforge.net/Profiles/'+lines.visible_name),data);
}
var basedir=resolveHome('~/.gconf/apps/gnome-terminal/profiles/');
var files = fs.readdirSync(basedir);
async.eachSeries(files,function(item,next){
	//console.log(item);
	if(item.indexOf('Profile')==0){
		var f=basedir+item+'/%gconf.xml';
		if(fs.existsSync(f)){
			xml2js.parseString(fs.readFileSync(f),{trim: true,explicitArray:false},function(err,xmldat){
				var lines={};
				for(var i=0;i<xmldat.gconf.entry.length;i++){
					lines[xmldat.gconf.entry[i].$.name]=xmldat.gconf.entry[i].stringvalue;
				}
				//console.log(lines)
				writeRoxTermProfile(lines);
				next();
			});
			return;
		}
	}
	next();
});

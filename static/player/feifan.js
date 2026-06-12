(function () {
	var url = String(MacPlayer.PlayUrl || '');
	var isDirectMediaUrl = /\.(m3u8|mp4|m4v|webm|ogg|ogv|flv|mpd)(\?|#|$)/i.test(url) || url.indexOf('magnet:') === 0 || url.indexOf('blob:') === 0;
	if (isDirectMediaUrl) {
		MacPlayer.Html = '<iframe border="0" src="'+maccms.path+'/static/player/dplayer.html" width="100%" height="100%" marginWidth="0" frameSpacing="0" marginHeight="0" frameBorder="0" scrolling="no" vspale="0" noResize></iframe>';
	} else {
		MacPlayer.Html = '<iframe width="100%" height="100%" src="'+url+'" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" sandbox="allow-same-origin allow-forms allow-scripts allow-popups allow-presentation" referrerpolicy="no-referrer"></iframe>';
	}
})();
MacPlayer.Show();

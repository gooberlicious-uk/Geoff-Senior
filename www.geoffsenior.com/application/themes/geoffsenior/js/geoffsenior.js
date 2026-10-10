/* SCROLL MAGIC
*/

var smController = new ScrollMagic.Controller();
new ScrollMagic.Scene({
	triggerHook: 0,
	duration: "100%"
})
.setTween (TweenMax.to ($("div.ccm-page"), 2, {
	backgroundPosition: "center 200px",
	ease: Power1.easeOut
}))
//.addIndicators()
.addTo(smController);



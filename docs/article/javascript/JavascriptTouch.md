# Javascript 监听触摸事件

```javascript
(function() {
  var touch = {};

  function direction(startX, changeX, startY, changeY) {
    return Math.abs(startX - changeX) >= Math.abs(startY - changeY)
      ? startX - changeX > 0
        ? "Left"
        : "Right"
      : startY - changeY > 0
      ? "Up"
      : "Down";
  }

  document
    .getElementsByTagName("body")[0]
    .addEventListener("touchstart", function(e) {
      touch.startY = e.targetTouches[0].pageY;
      touch.startX = e.targetTouches[0].pageX;
      //console.log("点击时的X坐标" + nStartX + "和Y坐标" + nStartY);
    });

  document
    .getElementsByTagName("body")[0]
    .addEventListener("touchmove", function(e) {
      touch.whenChangY = e.changedTouches[0].pageY;
      touch.whenChangX = e.changedTouches[0].pageX;
      //console.log("滑动时的X坐标" + nWhenChangX + "和Y坐标" + nWhenChangY);
    });

  document
    .getElementsByTagName("body")[0]
    .addEventListener("touchend", function(e) {
      touch.changY = e.changedTouches[0].pageY;
      touch.changX = e.changedTouches[0].pageX;
      //console.log("滑动后的X坐标" + nChangX + "和Y坐标" + nChangY);
      var swDirection = direction(
        touch.startX,
        touch.changX,
        touch.startY,
        touch.changY
      );
      console.log(swDirection);
    });
})();
```

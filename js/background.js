$(function () {
    img = new Array(6);
    img[0] = "img/1.jpg";
    img[1] = "img/2.jpg";
    img[2] = "img/3.jpg";
    img[3] = "img/4.jpg";
    img[4] = "img/5.jpg";
    img[5] = "img/6.jpg";

    $(document).ready(function () {
        var number = Math.floor(Math.random(
        ) * 6)
        $('style').append('body{background-image: url(' + img[number] + ');}')
    });
});

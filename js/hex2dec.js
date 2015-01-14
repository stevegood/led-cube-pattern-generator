/**
 * Created by B027906 on 1/13/2015.
 */
function h2d(h) { return parseInt(h, 16); }
function d2h(d) { return d.toString(16).toUpperCase(); }
function sumHex(vals) {
    var final = 0;
    for (var i in vals) {
        var hVal = vals[i],
            dVal = h2d(hVal);

        final += dVal;
    }
    final = d2h(final);
    while (final.length < 3) {
        final = '0' + final;
    }
    return final;
}
function calcular() {
    var sueldoBruto = $("#sueldoBruto").val(),
        isConyuge = $("input[name='conyuge']:checked").val(),
        isJubilado = $("input[name='jubilado']:checked").val(),
        isPatagonico = $("input[name='patagonico']:checked").val(),
        valorAlquiler = $("#alquiler").val(),
        deduccionAlquiler = 12 * valorAlquiler * .4 > TOPE_ALQUILER ? TOPE_ALQUILER : 12 * valorAlquiler * .4,
        valorHipotecario = $("#hipotecario").val(),
        deduccionHipotecario = 12 * valorHipotecario > TOPE_HIPOTECARIO ? TOPE_HIPOTECARIO : 12 * valorHipotecario,
		hijosElement = document.getElementById("hijos"),
        cantHijos = hijosElement.options[hijosElement.selectedIndex].value,
        sueldoNeto = 0 == isJubilado ? .17 * sueldoBruto > TOPE_APORTES ? sueldoBruto - TOPE_APORTES : .83 * sueldoBruto : .06 * sueldoBruto > TOPE_APORTES ? sueldoBruto - TOPE_APORTES : .94 * sueldoBruto;

    var sueldoNetoAnual = 13 * sueldoNeto,
        mniConDeduccionEspecial = (MINIMO_NO_IMPONIBLE + ADICIONAL_4TA_CATEGORIA) * (1.22 * isPatagonico + (1 - isPatagonico));
    mniTotal = (mniConDeduccionEspecial + CONYUGE * isConyuge + HIJO * cantHijos + deduccionAlquiler + deduccionHipotecario) * (1 - isJubilado) + isJubilado * (TOPE_JUBILADO + deduccionAlquiler + deduccionHipotecario),
        montoImponibleAplicable = 0,
        mniTotal < sueldoNetoAnual && (montoImponibleAplicable = sueldoNetoAnual - mniTotal);
    for (var n = [0, 0, 0, 0, 0, 0, 0, 0, 0], o = 0; o < n.length && (n[o] = calcularValorEscala(o, montoImponibleAplicable), n[o] == fijosEscalas[o]); o++);
    for (var p = o, impuestoAnual = 0, o = 0; o < n.length; o++) impuestoAnual += n[o];
    impuestoAnual = impuestoAnual.toFixed(2), $("#impuestoAnual").text("$" + impuestoAnual);
    var impuestoMensual = (impuestoAnual / 13).toFixed(2);
    $("#impuestoMensual").text("$" + impuestoMensual);
    var alicuota = impuestoMensual / sueldoBruto * 100;
    $("#alicuota").text(alicuota.toFixed(2) + "%");
    var alicuotaMarginal = 0 == alicuota ? 0 : 100 * porcentajesEscalas[p];
    $("#alicuotaMarginal").text(alicuotaMarginal.toFixed(2) + "%");
    var sueldoEnMano = sueldoNeto - impuestoMensual;
    $("#sueldoEnMano").text("$" + Math.round(sueldoEnMano) + ".00")
}

function calcularValorEscala(a, b) {
    var c = 0,
        d = 0;
    return a > 0 && (d = topesEscalas[a - 1]), c = b < topesEscalas[a] ? (b - d) * porcentajesEscalas[a] : fijosEscalas[a]
}
$(document).ready(function() {
    $("#calcular").on("click", function() {
        calcular()
    }), $(document).keypress(function(a) {
        13 == a.keyCode && (a.preventDefault(), calcular())
    }), $("input[name='jubilado']").click(function() {
        $("input[name='conyuge']").attr({
            disabled: 1 == $(this).val()
        }), $("input[name='patagonico']").attr({
            disabled: 1 == $(this).val()
        })
    })
});
var topesEscalas = [2e4, 4e4, 6e4, 8e4, 12e4, 16e4, 24e4, 32e4, 99999999],
    porcentajesEscalas = [.05, .09, .12, .15, .19, .23, .27, .31, .35],
    fijosEscalas = [1e3, 1800, 2400, 3e3, 7600, 9200, 21600, 24800],
    MINIMO_NO_IMPONIBLE = 51967,
    ADICIONAL_4TA_CATEGORIA = 249441.6,
    CONYUGE = 48447,
    HIJO = 24432,
    TOPE_APORTES = 10896.32,
    TOPE_JUBILADO = 407592,
    TOPE_ALQUILER = 51967,
	TOPE_HIPOTECARIO = 20000;

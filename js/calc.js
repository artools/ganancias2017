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
    
    var result = calcularImpuesto(montoImponibleAplicable);
    impuestoAnual = result.value.toFixed(2), $("#impuestoAnual").text("$" + impuestoAnual);

    var impuestoMensual = (impuestoAnual / 13).toFixed(2);
    $("#impuestoMensual").text("$" + impuestoMensual);
    var alicuota = impuestoMensual / sueldoBruto * 100;
    $("#alicuota").text(alicuota.toFixed(2) + "%");
    var alicuotaMarginal = 0 == alicuota ? 0 : 100 * porcentajesEscalas[result.escala];
    $("#alicuotaMarginal").text(alicuotaMarginal.toFixed(2) + "%");
    var sueldoEnMano = sueldoNeto - impuestoMensual;
    $("#sueldoEnMano").text("$" + Math.round(sueldoEnMano) + ".00")
}

function calcularImpuesto(monto) {
    var i = 0;
    var result = {};
    var value = 0;
    while(monto > topesEscalas[i]) {
        var diff = i == 0 ? topesEscalas[i] : topesEscalas[i] - topesEscalas[i - 1];
        value += diff * porcentajesEscalas[i];
        i++;
    }

    diff = i == 0 ? monto : monto - topesEscalas[i - 1];
    value += diff * porcentajesEscalas[i];

    result.value = value;
    result.escala = i;
    return result;
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
var topesEscalas = [25800, 51600, 77400, 103200, 154800, 206400, 309600, 412800, 99999999],
    porcentajesEscalas = [.05, .09, .12, .15, .19, .23, .27, .31, .35],
    MINIMO_NO_IMPONIBLE = 66917.91,
    ADICIONAL_4TA_CATEGORIA = 321205.968,
    CONYUGE = 62385.2,
    HIJO = 31461.09,
    TOPE_APORTES = 13926.16,
    TOPE_JUBILADO = 407592, 
    TOPE_ALQUILER = 51967,
	TOPE_HIPOTECARIO = 20000;

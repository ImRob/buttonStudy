'use strict';
var brands, models, years;

function find(key) {
    return function(value, arr) {
        return arr.filter(function(element) {
            if (element[key] === value) {
                return element;
            }
        });
    };
}

function list(key) {
    return function(arr) {
        return arr.map(function(obj) {
            return obj[key];
        });
    };
}

function createList(type) {
    return function(arr) {
        var parent = $('#' + type);
        arr.map(function(str) {
            parent.append('<option value="' + str + '"">' + str + '</option>');
        });
        return parent;
    };
}

function returnObject(arr) {
    return arr[0];
}


//find the brand
var findBrands = find('brandName');
var findModels = find('modelName');

//list the brand
var listBrands = list('brandName');
var listModels = list('modelName');
var listYears = list('year');

var brandDropDown = createList('brand');
var modelDropDown = createList('model');
var yearDropDown = createList('year');

var UI = {
    brand: false,
    model: false,
    year: false,
    submit: false
};

function clickEvents() {
    $('#brand').on('change', function(e) {
        var item = e.target.value;
        if(item==='default')return;
        UI.brand = true;
        UI.model = true;
        UI.year = false;
        UI.submit = true;

        $('#model, #year').children().not(':first-child').remove();

        models = returnObject(findBrands(item, brands)).models;
        modelDropDown(listModels(models));

        test(UI);
    });

    $('#model').on('change', function(e) {
        var item = e.target.value;
        if(item==='default')return;

        if (UI.year) {
            UI.year = false;
        } else {
            UI.year = true;
        }
        if (UI.brand) {
            UI.year = true;
        }

        $('#year').children().not(':first-child').remove();

        years = returnObject(findModels(item, models)).years;
        yearDropDown(listYears(years));
        test(UI);
    });

    $('#year').on('change', function(e) {
        var item = e.target.value;
        if(item==='default')return;

        UI.year = true;
        test(UI);
    });
}

function test(obj) {
    $('select').attr({ disabled: 'disabled' });
    for (var key in obj) {
        if (obj[key]) {
            $('#' + key).removeAttr('disabled');
        }
    }
    addStyles()
}

$(document).ready(function() {
    $.getJSON('./data.json', function(responseData) {
        clickEvents();
        brands = responseData.ymm.brands;
        brandDropDown(listBrands(brands));
    addStyles()

    });
});


function addStyles(){
	var $select = $('select');
	$select.each(function(ind,obj){
		$(obj).removeClass('on')
		if($(obj).attr('disabled')!=='disabled'){
			$(obj).addClass('on')
		}
	})
}
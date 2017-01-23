/**
 * demo
 * cailuwei<cailuw0603@163.com>
 */
'use strict';
define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        form = require('src/form');

    var SelectView = form.SelectView,
    	CheckboxView = form.CheckboxView,
    	RadioBoxView = form.RadioBoxView;


    var DemoView = Backbone.View.extend({
    	events: {
    		'change input[type=checkbox]': 'checkCheckbox',
    		'selected input[type=radio]':  'selectRadio',
    		'change .ul-dropdown>li>a':    'select'
    	},
    	initialize: function(options){

    		var _this = this;
    		this.$checkboxs = [];
    		this.$radios = [];
    		this.$selects = [];

    		//模拟checkbox
			_.each($('input[type=checkbox]'), function(item, index){
				_this.$checkboxs.push(new CheckboxView({
					el: $(item).parent()
				}));
			});

			//模拟radio
			_.each($('input[type=radio]'), function(item, index){
				_this.$radios.push(new RadioBoxView({
					el: $(item).parent()
				}));
			});

			//模拟select
			_.each($('.dropdown'), function(item, index){
				_this.$selects.push(new SelectView({
					el: $(item)
				}));
			});
    	},
    	'checkCheckbox': function(ev){

    		// this.$checkboxs[0].changeCkbStatus(true/flase);  切换第一个checkbox
    		alert('第一个复选框选中状态:' + this.$checkboxs[0].getStatus());

    	},
    	'selectRadio': function(ev){

    		// this.$radios[0].changeRadioStatus();  选中第一个radio
			alert('第一个单选框选中状态:' + this.$radios[0].getStatus());

    	},
    	'select': function(ev){
    		var $this = $(ev.currentTarget);

    		alert('选择列表选中值:' + $this.data('val'));
    	}
    });

    return {
    	run: function(){
    		new DemoView({
    			el: '#demo'
    		});
    	}
    };
    
});
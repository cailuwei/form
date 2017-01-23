/**
 * form 控件
 * cailuwei<cailuw0603@163.com>
 **/
'use strict';
define(function(require, exports, module){
	var $ = require('jquery'),
	    _ = require('underscore'),
	    Backbone = require('backbone');
	
	/**
	 * 模拟checkbox 
	 * box 不可以用label包裹
	 * <span class="checkbox-inline"><input type="checkbox" class="checkbox" name="" value=""/></span>
	 */
	var CheckboxView = Backbone.View.extend({
		events: {
			'click .checkbox-label': 'changeCkb'
		},
		initialize: function(options){
			this.model = new Backbone.Model();
			
			this.$box = this.$('input[type="checkbox"]');
			this.uncheck = false;
			this.check = true;
			this.checked = false;
			this.render();
			this.listenTo(this.model, 'change', this.changeCkbStatus);
		},
		'changeCkb': function(ev){
			var $this = $(ev.currentTarget);
			if(this.$box.prop('readonly') || this.$box.prop('disabled')){
            	return false;
            }

//			this.model.set({'checked': checked});
			this.model.trigger('change', this.$box.prop('checked') ? 'uncheck' : 'check');
		},
		changeCkbStatus: function(_checked, fromParent){
			this.checked = _checked === 'check' ? this.check : this.uncheck;
			if(this.checked){
				this.$box.prop('checked', true);
				// this.$label.addClass('checked');
				this.$label.removeClass('icon-square').addClass('icon-squarecheckfill');
			}else{
				this.$box.prop('checked', false);
				// this.$label.removeClass('checked');
				this.$label.removeClass('icon-squarecheckfill').addClass('icon-square');
			}
			
			if(!fromParent){
				this.$box.trigger('change');
			}
		},
		render: function(){
			this.$box.hide();
			if(!this.$box.next().hasClass('checkbox-label')){
				// this.$box.after('<label class="check-label"></label>');
				this.$box.after('<label class="checkbox-label iconfont"></label>');
			}
			
			this.$label = this.$('.checkbox-label');
			if(this.$box.hasClass('checkbox-all')){
				this.$label.addClass('checkbox-label-all');
			}
			
			if(this.$box.prop('checked')){
				// this.$label.addClass('checked');
				this.$label.addClass('icon-squarecheckfill');
			}else{
				// this.$label.removeClass('checked');
				this.$label.addClass('icon-square');
			}
			
			return this;
		},
		getStatus: function(){
			return this.$box.prop('checked');
		}
	});
    
    /**
	 * 模拟radio 
	 * box 不可以用label包裹
	 * <span class="radio-inline"><input type="radio" class="radio" name="" value=""/></span>
	 */
	var RadioBoxView = Backbone.View.extend({
		events: {
			'click .radio-label': 'changeRadio'
		},
		initialize: function(options){
			
			this.$box = this.$('input[type="radio"]');
			this.render();
		},
		'changeRadio': function(ev){
			var $this = $(ev.currentTarget);
			if(this.$box.prop('readonly') || this.$box.prop('disabled')){
            	return false;
            }else if(this.$box.prop('checked')){
            	return false;
            }
			this.name = this.$box.attr('name');
			this.changeRadioStatus();
		},
		changeRadioStatus: function(isInit){
			
			this.$box.prop('checked', true);
			if(!isInit){
				// $('input[name=' + this.name + ']').next().removeClass('selected');
				$('input[name="' + this.name + '"]').next().removeClass('icon-roundcheckfill').addClass('icon-round');
			}
			// this.$label.addClass('selected');
			this.$label.removeClass('icon-round').addClass('icon-roundcheckfill');
			this.$box.trigger('selected');
		},
		render: function(){
			this.$box.hide();
			if(!this.$box.next().hasClass('radio-label')){
				// this.$box.after('<label class="radio-label"></label>');
				this.$box.after('<label class="radio-label iconfont"></label>');
			}
			
			this.$label = this.$('.radio-label');
			
			if(this.$box.prop('checked')){
				// this.$label.addClass('selected');
				this.$label.addClass('icon-roundcheckfill');
			}else{
				// this.$label.removeClass('selected');
				this.$label.addClass('icon-round');
			}
			
			this.delegateEvents();
			return this;
		},
		getStatus: function(){
			return this.$box.prop('checked');
		}
	});
	
	/**
	 * 模拟select SelectCollection
	 */
	var li = '<li class="selected"><a href="javascript:" data-val="{{val}}" >{{name}}</a></li>',
		text = {val: 1, name: 'text1'};
		
	var SelectCollection = Backbone.Collection.extend({
		idAttribute: 'id',
		initialize: function(model, options){
			
			if(options.url){
				this.url = options.url;
			}
            
            if(options.sync){
				this.update();
			}
            
			this.extractResult = options.extractResult || function (res) {
				return res;
			};
			
		},
		parse: function(rsp){
			return this.extractResult(rsp);
		}
	});

	/**
	 * 模拟select
	 * <div class="dropdown">
	 * 	<div class="input-group">
	 *    <input type="text" id="" readonly class="form-control"  placeholder="" />
	 *    <span class="input-group-addon" role="select" ><i class="iconfont icon-unfold"></i></span>
	 *  </div>
	 *  <input type="hidden" id="" name="" />
	 *  <ul class="ul-dropdown"></ul>
	 * </div>
	 * 
	 * @param store 异步获取下拉列表的数据
	 * @param data  collection 格式下拉列表数据
	 * jstl 获取列表数据，则不需要初始化store和data
	 */
	var SelectView = Backbone.View.extend({
		idAttribute: 'id',
		events: {
			'click a': 'select',
			'click [role="select"]': 'showSelect',
			'click input[type=text]': 'hideSelect'
		},
		initialize: function(options){

			if(options.store){
				this.store = new SelectCollection(null, options.store);

//				this.listenTo(this.store, 'add', this.renderUl);
				this.listenTo(this.store, 'reset', this.setData);
				this.listenTo(this.store, 'error', this.error);
//				this.listenTo(this.store, 'sync', this.sync);
			}
			
			if(options.data){
				this.setData(options.data);
			}
			
			this.cacheEls();
			this.render();

		},
		cacheEls: function(){
			this.$ul = this.$('.ul-dropdown');
			this.$text = this.$('input[type=text]');
			this.$val = this.$('input[type=hidden]');
			this.$addon = this.$('.input-group-addon');
			this.$i = this.$addon.children();
		},
		renderUl: function(model){			
			var tmpl = template(li);
			this.$ul.append(tmpl(model.toJSON()));
		},
		render: function(){
			var $selected = this.$('li.selected>a');
			
			this.$text.val($selected.html());
			this.$val.val($selected.data('val'));
		},
		'select': function(ev){
			var $this = $(ev.currentTarget),
				val = $this.data('val'),
				name = $this.html();
			
			this.$text.val(name);
			this.$val.val(val);
			this.$ul.slideUp();
			this.toggleCurrentClass('slideup');
			$this.trigger('change');
		},
		'showSelect': function(ev){
			if(this.$i.hasClass('icon-fold')){
				this.$ul.slideUp();
				this.toggleCurrentClass('slideup');
			}else{
				this.$ul.slideDown();
				this.toggleCurrentClass('slidedown');
			}
			
		},
		'hideSelect': function(ev){
			if(this.$i.hasClass('icon-unfold')){
				return false;
			}
			this.$ul.slideUp();
			this.toggleCurrentClass('slideup');
		},
		toggleCurrentClass: function(type){
			if(type === 'slidedown'){
				this.$i.removeClass('icon-unfold').addClass('icon-fold');	
			}else{
				this.$i.removeClass('icon-fold').addClass('icon-unfold');
			}
		},
		error: function(col, rsp, opt){
			console.log('发生错误，请稍后再试');
		},
		_set: function(data){
			this.store.fetch({
				data: data,
				reset: true
			});
		},
		setData: function(collection, opt){
			var _this = this;
			this.$ul.empty();
			collection.map(function(item, index, list){
				_this.renderUl(item);
			});
		}
	});
	
	return {
		SelectView: SelectView,
		CheckboxView: CheckboxView,
		RadioBoxView: RadioBoxView
	}
});
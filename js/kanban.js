/* ***
*
*

Copyright (C) 2010  Leandro Vázquez Cervantes (leandro[-at-]leandro[-dot-]org)
Copyright (C) 2010  Octavio Benedí Sánchez (octaviobenedi[-at-]gmail[-dot-]com)
Copyright (C) 2010  Verónica Pazos (verocorella[-at-]gmail[-dot-]com)

GNU LESSER GENERAL PUBLIC LICENSE

Version 3, 29 June 2007

Copyright © 2007 Free Software Foundation, Inc. <http://fsf.org/>

Everyone is permitted to copy and distribute verbatim copies of this license document, but changing it is not allowed.

This version of the GNU Lesser General Public License incorporates the terms and conditions of version 3 of the GNU General Public License, supplemented by the additional permissions listed below.

version 0.3g Leandro  18 NOV 2012
AGPL to LGPL v3 change
*
*
*** */

$(document).ready(function() {
  
	/* Manipulación de columnas */
	
	$('#add_col').click(function(){
		var id=$(".task_pool").size();
		$(".task_pool_header:last").addClass("dotted_separator");
		$(".task_pool:last").addClass("dotted_separator");
		
		$("#task_pool_header_container").append('<th class="task_pool_header"><div class="header_name click">'+id+'</div><div wip="0" class="WIP">WIP: Ilimitado</div></th>');
		$("#task_pool_container").append('<td class="task_pool"><div /></td>');
		intialize_sortables();
	});
	$('#remove_col').click(function(){	   
	   if($(".task_pool_header").size()>1){
	    	$(".task_pool_header").last().remove();			
    		$(".task_pool").last().remove();
    		
    		$(".task_pool_header:last").removeClass("dotted_separator");
			$(".task_pool:last").removeClass("dotted_separator");
		    intialize_sortables();
		}
	});	

	$('.header_name').live('click',function(){
		var cur_name=$(this).children("span").html();
		var wip = $(this).parent().children("div:eq(1)").attr("wip");
		wip = check_number(wip);
		var header_new_html=' \
		<div class="header_input"> \
			Nombre<br/><input onkeypress="javascript:save_edit_h(event)" class="input header_input_name" value="'+cur_name+'" /> \
		</div>  \
		<div class="header_input"> \
			WIP<br/><input onkeypress="javascript:save_edit_h(event)" class="input header_input_name" value="'+wip+'" /> \
		</div>  \
		<div class="small"> \
			<div class="option save_header"><button class="btn btn-success btn-mini"><i class="icon-white icon-ok">&nbsp;</i></button></div> \
		</div> \
		<div class="clear"></div> \
		';
		$(this).parent().html(header_new_html);
	});
	$('.save_header').live('click',function(){
    	var index=$(this).parent().parent().index();    	
		var new_name=$(this).parent().parent().children("div:eq(0)").first().children(".input").first().val();
		var wip=$(this).parent().parent().children("div:eq(1)").first().children(".input").first().val();
		wip = check_number(wip);
		if(index==0){
		    wip=0; // Primera columna debe tener el wip ilimitado
		}
		if(wip>0){
    		$(this).parent().parent().html('<div class="header_name click"><img class="title_bullet" src="img/mookup/bullet.png" /><span class="title_text">'+new_name+'</span></div><div wip="'+wip+'" class="WIP">WIP: '+wip+'</div>');
		}else{
        	$(this).parent().parent().html('<div class="header_name click"><img class="title_bullet" src="img/mookup/bullet.png" /><span class="title_text">'+new_name+'</span></div><div wip="'+wip+'" class="WIP">WIP: Unlimited</div>');
    	}
	});

	/* Manipulación de tareas */
	$('#add_task').click(function(){
		var id=find_next_box_itm_free(1);
		$(".task_pool").first().append(' \
		  <div class="big_container"> \
			  <div id="box_itm'+id+'"class="box_itm rounded"> \
				  <div id="name'+id+'" class="name">Item '+id+'</div> \
				  <div class="dotted_hr"></div> \
				  <div id="resp'+id+'" class="name">Resp '+id+'</div> \
				  <progress max="100" id="progress_bar'+id+'" class="pbar" value="0"></progress> \
				  <div class="small"> \
					  <div n="'+id+'" class="itm_box_option"><input n="'+id+'"  class="color colorete" type="color" data-text="hidden" data-colorlink="box_itm'+id+'" value="#f7941d"></div> \
					  <div n="'+id+'" class="option close itm_box_option"><button class="btn btn-danger btn-mini"><i class="icon-white icon-remove"></i></button></div> \
					  <div n="'+id+'" class="option edit itm_box_option"><button class="btn btn-info btn-mini"><i class="icon-white icon-pencil"></i></button></div> \
				  </div> \
				  <div class="clear"></div> \
			  </div> \
			  <div id="box_itm'+id+'_shadow" class="shadow" /> \
			<div> \
		');
		
		$( "#box_itm"+id+" .itm_box_option input" ).mColorPicker();
		$('.itm_box_option').hide();
	});

	$('.box_itm').live('mouseover',function(){
		$(this).children().children('.itm_box_option').show();
	});
	$('.box_itm').live('mouseout',function(){
		$('.itm_box_option').hide();
	});
	
	$('.colorete').live('colorpicked', function () {
    $('#box_itm'+$(this).attr('n')).css('background',$(this).val());
	});
	
	
	$(".save").live('click', function(){
		var id = $(this).attr("n"); 
		var box_itm_name=$('#name_input'+id).val();
		var box_itm_resp=$('#resp_input'+id).val();
		var pbar_value=parseInt($('#progress_input'+id).val());
		pbar_value = check_number(pbar_value);
		var box_itm_new_html=' \
		    <div class="big_container"> \
				  <div id="name'+id+'" class="name">'+box_itm_name+'</div> \
				  <div class="dotted_hr"></div> \
				  <div id="resp'+id+'" class="name">'+box_itm_resp+'</div> \
				  <progress max="100" id="progress_bar'+id+'" class="pbar" value="'+pbar_value+'"></progress> \
				  <div class="small"> \
				    <div n="'+id+'" class="itm_box_option"><input n="'+id+'"  class="color colorete" type="color" data-text="hidden" data-colorlink="box_itm'+id+'" value="#f7941d"></div> \
					  <div n="'+id+'" class="option close itm_box_option"><button class="btn btn-danger btn-mini"><i class="icon-white icon-remove"></i></button></div> \
					  <div n="'+id+'" class="option edit itm_box_option"><button class="btn btn-info btn-mini"><i class="icon-white icon-pencil"></i></button></div> \
				  </div> \
				  <div class="clear"></div> \
				<div> \
		';
		$('#box_itm'+id).html(box_itm_new_html);
		$( "#box_itm"+id+" .itm_box_option input" ).mColorPicker();
		
		$('#box_itm'+id).live('mouseover',function(){
		  $(this).children().children().children('.itm_box_option').show();
	  });
	  $('#box_itm'+id).live('mouseout',function(){
		  $('.itm_box_option').hide();
	  });
	  
	  $('.colorete').live('colorpicked', function () {
      $('#box_itm'+$(this).attr('n')).css('background',$(this).val());
	  });
	  
	});
	
	
	$('.edit').live('click', function() {
		var id = $(this).attr("n");
		var box_itm_name=$('#name'+id).html();
		var box_itm_resp=$('#resp'+id).html();
		var pbar_value=parseInt($('#progress_bar'+id).prop('value'));
		if (isNaN(pbar_value)){ var pbar_value=0;}
		var box_itm_new_html=' \
				<div><span class="small">Name of the task:</span><input onkeypress="javascript:save_edit(event)" id="name_input'+id+'" class="input" value="'+box_itm_name+'" /></div>  \
				<div><span class="small">Responsible:</span><input onkeypress="javascript:save_edit(event)" id="resp_input'+id+'" class="input" value="'+box_itm_resp+'" /></div>  \
				<div><span class="small">Progress:</span><input onkeypress="javascript:save_edit(event)" id="progress_input'+id+'" class="input" value="'+pbar_value+'" /></div>  \
				<div class="small"> \
					<div n="'+id+'" class="option save"><button class="btn btn-success btn-mini"><i class="icon-white icon-ok">&nbsp;</i></button></div> \
				</div> \
				<div class="clear"></div> \
		';
		$('#box_itm'+id).html(box_itm_new_html);
	});
	
	$('.close').live('click', function() {
		var id = $(this).attr("n");		
		$('#box_itm'+id).remove();
		$('#box_itm'+id+'_shadow').remove();
	});
	
	$('#txt_btn').click(function(){
			$('#texto').toggle('slow');
	});

        intialize_sortables();
});

/* Funciones auxiliares */
function intialize_sortables(){
	$( ".task_pool" ).sortable({
			connectWith: ".task_pool",
			delay:25,
			revert:true,
			dropOnEmpty: true,
			forcePlaceHolderSize: true,
 			helper: 'clone',
 			forceHelperSize: true,
			receive: function(event, ui) {
					var itms= $(this).children(".big_container").length;
					var index=$(this).index();
					var wip=  $(this).parent().parent().children("tr th:eq("+index+")").children("div:eq(1)").first().attr("wip");
					wip = check_number(wip);
					if((wip!=0)&&(itms>wip))
					{
						$(ui.sender).sortable('cancel');
						//alert("WIP exceded");
					}
				}
	});
	$('.itm_box_option').hide();
};
function find_next_box_itm_free(id){
	if($('#box_itm'+id).length)
	{
		id++;
		return find_next_box_itm_free(id);
	}
	else
	{
		return id;
	}
}
function check_number(number){
    if(isNaN(number)||(number<0))
	{
		number=0;
	}
	else if (number>100)
	{
		number=100;
	}
	return number;
}

function save_edit(e){
	var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
		
	if(code==13) { $(".save").click(); }
}

function save_edit_h(e){
	var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
		
	if(code==13) { $(".save_header").click(); }
}

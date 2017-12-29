$.extend($.expr[':'], {
	'containsi': function(elem, i, match, array){
		return (elem.textContent || elem.innerText || '').toLowerCase()
		.indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});

$(document).ready(function(){

	$('#sidebar').mCustomScrollbar({
		theme: "minimal"
	});

	$('#sidebarCollapse').click(function(e){
		$('#sidebar').toggleClass('active');
		$('#content').toggleClass('active');
	});

	$('#sidebar ul li ul li a').click(function(e){
		$('#sidebar ul li ul li a').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
	});

	$('#apiSearchInput').on('input', function(e){
		var keyword = $('#apiSearchInput').val();
		if (!keyword) {
			$("#sidebar ul li ul li").css("display", "");
			$("#sidebar .sidebar-search #resetSearch").css("display", "none");
			return;
		}

		$("#sidebar ul li ul li").css("display", "none");
		$("#sidebar ul li ul li:containsi('"+keyword+"')").css("display", "");
		$("#sidebar .sidebar-search #resetSearch").css("display", "inline");
	});

	$("#sidebar .sidebar-search #resetSearch").click(function(e){
		$('#apiSearchInput').val("");
		$("#sidebar ul li ul li").css("display", "");
		$("#sidebar .sidebar-search #resetSearch").css("display", "none");
	});

});

/*** Function for Send Sample Request ***/
function resetSampleRequest(api_id){
	clearSampleResponse(api_id);
}

function clearSampleResponse(api_id){
	if (!api_id) return;

	$('#'+api_id+' .api-sample-response-header #heading').html("Response ");
	$('#'+api_id+' .api-sample-response-body').html("");
	$('#'+api_id+' .api-sample-response-footer').html("Time: ");
	$('#'+api_id+' .api-sample-response').hide();
}

function sendSampleRequest(api_id, api_type){
	if (!api_id) return;

	var url = $('#'+api_id+" input[name='url']").val();
	var contentType = (api_type === "get") ? "application/x-www-form-urlencoded" : false;
	var processData = (api_type === "get");
	var formData = (api_type === "get") ? {} : new FormData();
	var headers = {};
	if (api_type === "get") {
		$('#'+api_id+' .api-sample-body input').each(function(){
			formData[$(this).attr('name')] = $(this).val();
		});
	} else {
		$('#'+api_id+' .api-sample-body input').each(function(){
			formData.append($(this).attr('name'), $(this).val());
		});
	}
	$('#'+api_id+' .api-sample-header input').each(function(){
		headers[$(this).attr('name')] = $(this).val();
	});
	var start_time = Date.now();
	// formData.append('action', 'previewImg');
	$.ajax({
		type: api_type,
		url: url,
		headers: headers,
		data: formData,
		contentType: contentType,
		processData: processData,
		beforeSend: function() {
			// TODO: loading image here
		},
		success: function(response, status, xhr) {
			$('#'+api_id+' .api-sample-response').removeClass('panel-danger').addClass('panel-success').show();
			$('#'+api_id+' .api-sample-response-header #heading').html("Response "+xhr.status+" "+xhr.statusText);
			$('#'+api_id+' .api-sample-response-body').html("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
			$('#'+api_id+' .api-sample-response-footer').html("Time: "+(Date.now()-start_time)+"ms");
			$('#'+api_id+' .api-sample-response-header .close').click(function(){
				clearSampleResponse(api_id);
			});
		},
		error: function(xhr, status, error) {
			var response = xhr.responseJSON;
			$('#'+api_id+' .api-sample-response').removeClass('panel-success').addClass('panel-danger').show();
			$('#'+api_id+' .api-sample-response-header #heading').html("Response "+xhr.status+" "+xhr.statusText);
			$('#'+api_id+' .api-sample-response-body').html("<pre>"+JSON.stringify(response, null, 2)+"</pre>");
			$('#'+api_id+' .api-sample-response-footer').html("Time: "+(Date.now()-start_time)+"ms");
			$('#'+api_id+' .api-sample-response-header .close').click(function(){
				clearSampleResponse(api_id);
			});
		}
	});
}
$(document).ready(function () {

	$('#sidebar').mCustomScrollbar({
		theme: "minimal"
	});

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
		$('#content').toggleClass('active');
	});

	$('#sidebar ul li ul li a').click(function(e) {
		$('#sidebar ul li ul li a').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
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
	if (api_type === "get") {
		formData.section = "general";
	} else {
		formData.append("section", "general");
	}
	var start_time = Date.now();
	// formData.append('action', 'previewImg');
	$.ajax({
		type: api_type,
		url: url,
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
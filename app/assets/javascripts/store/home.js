$(function(){
	$(".region-breadcrumb").on("click", function(){
		$("#address").val($(this).html());
		$("#btn-locate").click();
	});
});

function clickBreadcrumb(region)
{
	$("#address").val(region);
	$("#btn-locate").click();
}
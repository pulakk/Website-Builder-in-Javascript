window.onload = function(){
    $('.load-project').on('click',function(){
        $('#project-name').val($(this).html());
    });
}

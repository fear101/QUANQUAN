(function(){

	new Promise(function(resolve,reject){
		//console.log(2)
			// 这个调用能触发目标事件，从而达到共享数据的目的
			if (!sessionStorage.length) {
				localStorage.setItem('getSessionStorage', Date.now());
			} 
			resolve()
		}).then(function(){
			setTimeout(function () {
				$.ajaxSetup({
					headers:{
					/* token验证 */
						token:sessionStorage.getItem("token"),
					},
				});
				//console.log(sessionStorage.token)
			},0);
		}).catch(function(){
			console.log(4)
		})
	/* 清除sessionStorge中的search字段 */
	if(location.search.length===0){
		sessionStorage.removeItem("search");
	}
	/* 判断是否登录 */
	$.if_login = function(){
		let e;
		$.ajax({
			url:"http://8.129.177.19:8085/user/selfuser",
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:5000,//超时时间设置为10秒；
			async:false,
			success:function(data){
				//console.log(data)
				if(data.code=="200"){
					sessionStorage.setItem("userId",data.data.userId);
					sessionStorage.setItem("username",data.data.username);
					let pic_href = JSON.parse(data.data.avatarPicture)[0];
					sessionStorage.setItem("pic","http://123.56.160.202/hutquan/headPhoto/"+pic_href);
					//hearder_info(true);
					e=true;
				}else{
					//sessionStorage.clear()
					console.log(data);	
					e=false;
				}
			},
			error:function(){
				//hearder_info(false);
				e=false;
			}
		});
		return e;	
	}
	/* 判断是否登录 */
	setTimeout(function () {
		var pattern='index.html';
		let path=location.pathname;
		if ($.if_login()) {
			hearder_info(true)
		} else if(location.pathname.match(pattern)){
			location.pathname="/QUANQUAN/view/login.html";
		}else{
			hearder_info(false);
		}
	},8)
	/* 登录 */
	function login(){
		$.ajax({
			url:'http://8.129.177.19:8085/tele/xhLogin',
			data:JSON.stringify($("#login").serializeJson()),
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			async:false,
			success:function(data){	
				if (data.code == '200') {
					sessionStorage.setItem("token",data.msg);
					localStorage.setItem("setItem",data.msg);
					$(".popup p.login-tips").text("");
					window.location.reload();
					
				} else if(data.code=='400'){
					$(".popup p.login-tips").text("用户名或密码错误");
				}		
			}
		});
	}
	/* 输入框文本上移 */
	function focusInputLoginBox(obj) {
	    obj.prev(".item_tip").addClass("item_tip_focus");
	}
	
	function blurInputLoginBox(obj) {
	    const v = obj.val();
	    if (v ==="") {
	        obj.prev(".item_tip").removeClass("item_tip_focus item_tip_val");
	    } else {
	        obj.prev(".item_tip").addClass("item_tip_focus item_tip_val");
	    }
	
	}
	
	$.input = function (name,type,text){
		let div = $("<div class = 'login-account'>");
		let em = $("<p class='item_tip'>").text(text);
		let input = $("<input type="+type+" name="+name+" class='input form_input'/>");
		div.append(em,input);
		if (text == '密码') {
			let button = $("<button class='Button button-password'><span class='iconfont icon-browse'/></button>")
			div.append(button);
		}
		
		return div;
	}
	
	/* 登录弹窗 */
	$.loginDIV = function(){
		let body=$("body");
		body.children("div").eq(2).remove();
		
		let div = $("<div>");
		let div_div = $("<div class='popup'>");
		let pop_div = $("<div class='box login-box'>");
		let from_div = $("<form class='login-from' id='login' autocomplete='off'>");
		let form_tile = $("<div class='login-tab'>");
		let span = $("<span>").text("教务系统登录");
		let strong = $("<p class='login-tips'>");
		let Button = $("<button class='Button button--pink button-login' type='submit'>").text("登录");
		let em_close = $("<em class='iconfont icon-close'>");
		form_tile.append(span)
		from_div.append(form_tile,strong,
			$.input("xh","text","学号"),
			$.input("passwd","password","密码"),$("<keygen name=''>"),Button);
		pop_div.append(from_div,em_close);
		div_div.append(pop_div);
		div.append(div_div);
		body.css({ 
		　　"overflow-x":"hidden",
		　　"overflow-y":"hidden"
		});
		div_div.ready(function() {
			/* 禁止回车提交表单 */
			$("input").blur(function(){
				blurInputLoginBox($(this));
			})
			$("input").focus(function(){
				focusInputLoginBox($(this));
			})
			$(".icon-close").click(function(){
				$(".box.login-box").addClass("box-delete");
				setTimeout(function(){div.remove();},600);
				body.css({
				　　"overflow-x":"auto",
				　　"overflow-y":"auto"
				});
			})
			$(".button-login").click(function(){
				if($("input[name='xh']").val()===null||$.trim($("input[name='xh']").val()).length===0){
					$(".popup p.login-tips").text("学号不能为空");
					focusInputLoginBox($("input[name='xh']"));
					return false;
				}else if($("input[name='passwd']").val()===null||$.trim($("input[name='passwd']").val()).length===0){
					$(".popup p.login-tips").text("密码不能为空");
					focusInputLoginBox($("input[name='passwd']"));
					return false;
				}
				$(".popup p.login-tips").text("");
				$("#login").submit(function(e){
					e.preventDefault();/* 阻止默认事件 */
					login();
				});
			});
			$(".button-password").click(function(e) {
				e.preventDefault();/* 阻止默认事件 */
				e.stopPropagation()
				if ($("input[name='passwd']").attr("type")==="password") {
					$("input[name='passwd']").attr("type","text");
					$(this).children().eq(0).removeClass("icon-browse");
					$(this).children().eq(0).addClass("icon-Notvisible");
				} else{
					$("input[name='passwd']").attr("type","password");
					$(this).children().eq(0).removeClass("icon-Notvisible");
					$(this).children().eq(0).addClass("icon-browse");
				}
				
			})
		})
		body.append(div);
	}
	
	/* 搜索框样式 */
	if ($("input[name='search']").val().length===0) {
			$('.Button.SearchBar-searchButton').css("color","pink");
			$('.Button.SearchBar-searchButton').removeClass("button--pink");
		} else{
			$('.Button.SearchBar-searchButton').addClass("button--pink");
	}
	$("input[name='search']").focus(function () {
		if ($("input[name='search']").val().length===0) {
			$('.Button.SearchBar-searchButton').css("color","pink");
			$('.Button.SearchBar-searchButton').removeClass("button--pink");
		} else{
			$('.Button.SearchBar-searchButton').css("color","");
			$('.Button.SearchBar-searchButton').addClass("button--pink");
		}
	})
	$("input[name='search']").blur(function () {
		$('.Button.SearchBar-searchButton').css("color","");
		if ($("input[name='search']").val().length===0) {
			$('.Button.SearchBar-searchButton').removeClass("button--pink");
		} else{
			$('.Button.SearchBar-searchButton').addClass("button--pink");
		}
	})
	/* 提交框的内容 */
	$('.Button.SearchBar-searchButton').click(function (){
		let search = $("input[name='search']").val();
		console.log(search);
		if (search.length===0) {
			return false;
		}
		sessionStorage.setItem("search",search);
		location.href = '/QUANQUAN/view/search.html?'+"search="+search;
	})
	
	function hearder_info(e){
		
		let hearder = $(".baseHeader .hearder-info");
		hearder.empty();
		/* 已经登录后的头部修改 */
		if(e){
			let div_user=$(`<div class='user-img'><button id='Image' class='Button button-pics'><img class='user-pic' srcset='`+sessionStorage.getItem("pic")+`'/></button></div>`);
			hearder.append(div_user);
			/* 个人信息 */
			div_user.ready(function(){
				var detailes = $("#detailes");
				let right = $("header.baseHeader").width()-$("header .baseHeader-nav").outerWidth();
				$(window).resize(function(){
					right = $("header.baseHeader").width()-$("header .baseHeader-nav").outerWidth();
					right = right/2-14;
					if (right<=22) {
						detailes.css({"top":"72px","right":22});
					} else{
						detailes.css({"top":"72px","right":right});
					}
				});
				detailes.css({"top":"72px","right":right/2-14});
				$("#Image").click(function(){
					if (detailes.children().length===0) {
						let span = $('<span class="triangle">');
						let div = $('<div class="menu-detailes">');
						//let a_1 = $('<strong class="user">'+sessionStorage.username+'</strong>');
						let a_2 = $('<a href="javascript:void(0);" class="user iconfont icon-switch">退出登录</a>');
						div.append(a_2);
						detailes.append(span,div);
						a_2.click(function(e){
							e.preventDefault();
							$.ajax({
								url:"http://8.129.177.19:8085/user/out",
								dataType:'json',//服务器返回json格式数据
								type:'get',//HTTP请求类型
								timeout:10000,//超时时间设置为10秒；
								error:function(){
									sessionStorage.removeItem("token");
									localStorage.setItem("removeItem",Date.now());
									window.location.reload();
								}
							})
							
						})
					} else{
						detailes.empty();
					}
				})
			})
		}else{
			/* 未登录的头部 */
			let div =$("<div class='info-button'></button>");
			let login = $("<button type='button' class='Button Button-login'>登录</button>");
			let register = $("<button type='button' class='Button button--pink'>注册圈圈</button>");
			div.append(login,register);
			hearder.append(div);
			div.ready(function(){
				$(".info-button .Button").click(function() {
					$.loginDIV();
				});
			})
		}
	}
	/* 头部导航条切换 */
	$("li.tap-items a.links-a").click(function(){
		$("a.links-a").removeClass("active");
		$(this).addClass('active');
	})
	/* 动态发布弹窗 */
	$.dynamicDIV = function () {
		let body=$("body");
		body.children("div").eq(2).remove();
		body.css({
		　　"overflow-x":"hidden",
		　　"overflow-y":"hidden"
		});
		let div = $('<div>'
				+'<div class="dynamic">'
					+'<div class="box box-dynamic">'
						+'<div class="dynamicm-conten">'
							+'<form class="dynamic-form" id="dynamic">'
								+'<div class="dynamic-item">'
									+'<img class="item-img" src="'+sessionStorage.getItem("pic")+'" width="50" height="50"/>'
									+'<div class="dynamic-text">'
										+'<textarea class="dynamic-textarea" name="message"  placeholder="分享你的学习和或生活动态(6-100字)" maxlength="100"></textarea>'
										+'<p class="word-number">字数：<span></span></p>'
										+'<div class="dynamic-tips">'
											+'<span class="tips">至少6个字</span>'
										+'</div>'
									+'</div>'
									+'<div class="content-img">'
										+'<ul class="content-img-list">'
											
										+'</ul>'
										+'<div class="file">'
											+'<span class="img-span"><i class="iconfont icon-upload"></i><br />上传图片(最多9张)</span><input type="file" name="file" accept="image/jpeg,image/x-png,image/gif" id="upload" multiple="multiple">'
										+'</div>'
									+'</div>'
								+'</div>'
								+'<div class="dynamic-footer">'
									+'<button type="button" class="Button button--pink">发布动态</button>'
								+'</div>'
							+'</form>'
						+'</div>'
						+'<em class="iconfont icon-close"></em>'
					+'</div>'
				+'</div>'
			+'</div>');
		div.ready(function () {
			$("textarea").on("input",function(){
				limit($(this));
			}) 
			
			//字数限制和显示
			function limit(t){
				let a = t.val().length;
				t.next().children().eq(0).text(a);	
			}
			$(".dynamic-tips .tips").hide();
			$(".icon-close").click(function(){
				$(".box.box-dynamic").addClass("box-delete");
				setTimeout(function(){div.remove()},600);
				body.css({
				　　"overflow-x":"auto",
				　　"overflow-y":"auto"
				});
			})
			/* 添加并预览图片 */
			$("#upload").change(function(){
				let imgLength = $(".content-img-list").children().length;
						
				if((this.files.length+imgLength)>9){
					return alert("最多只能上传9张图片");
				}
				for (var i = 0; i < this.files.length; i++) {
					var imgSize = this.files[i].size;  //b
					if(imgSize>1024*1024*5){//1M
						return alert("上传图片不能超过5M");
					}
					if(this.files[i].type != 'image/png'&&
					this.files[i].type != 'image/gif'&&
					this.files[i].type!='image/jpg'&&
					this.files[i].type!='image/jpeg'&&
					this.files[i].type!='image/jfif'&&
					this.files[i].type!='image/pjpeg'&&
					this.files[i].type!='image/pjp'){
						return alert("图片上传格式不正确");
					}
					var file = this.files[i];
					r = new FileReader();  //本地预览
					r.onload = function(e){
						//console.log(e.target.result);
						addNewContent($(".content-img-list"),e.target.result)
					}
					r.readAsDataURL(file);    //Base64
				}
				/* 隐藏上传按钮 */
				if((imgLength+this.files.length)===8){
					$('.content-img .file').hide();
				}
				/* 预览图片 */
				function addNewContent(obj,src) {
					$(obj).append('<li class="content-img-list-item"><img src="'+src+'" alt=""><a class="delete-btn"><i class="iconfont icon-delete"></i></a></li>');
				}
			})
			/* 删除图片 */	
			$(".content-img-list").on("click",".content-img-list-item a.delete-btn",function () {
				//console.log($(".content-img-list-item").length)
				let item = $(".content-img-list-item");
				$(this).parent().remove();
				if(item.length<8){//显示上传按钮
					$('.content-img .file').show();
				}
			})
			/* 限制动态的发布 */
			let c=false;
			$(".dynamic-footer .Button").click(function(){
				if(c){
					return false;
				}
				let message = $("#dynamic").serializeJson().message;
				//console.log(message.length<10);
				if (message.length<6) {
					$(".dynamic-tips .tips").show();
					return false;
				}
				//console.log($("#dynamic").serializeJson().message)
				let e = $(".content-img .content-img-list").find("img");
				//获取数组最后一个元素
				/* let files = {url:e,orientation:1,file:File(818905)}
				  let hasFiles = files[Object.keys(files).pop()] // 参考上面的图片
				  console.log(hasFiles);
				  let file = hasFiles.url
				  let name = hasFiles.file.name
				  let type = hasFiles.file.type */
				//base64图片数据
				//console.log(e);
				var fd = new FormData();
				
				//e.forEach()
				//console.log(e.length);
				for (let i = 0; i < e.length; i++) {
					//console.log(e.eq(i));
					var dataurl=e.eq(i).attr("src");
					/* base64格式转换为上传导服务器的形式 */
					var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
					while(n--){
						u8arr[n] = bstr.charCodeAt(n);
					}
					let obj = new Blob([u8arr], {type:mime});
					
					var suffix = mime.split("/")[1];
					//console.log(suffix);
					//getImgFiles();
					fd.append("file",obj,"image."+suffix)
				}
				fd.append("message",$("#dynamic").serializeJson().message);
				//console.log(fd.getAll("message"));
				
				c=true;
				//上传到服务器
				$.ajax({
					url: "http://8.129.177.19:8085/withfriend/releasedc",
					type: "POST",
					dataType:'json',//服务器返回json格式数据
					cache: false,  
					processData: false,  
					contentType: false,
					data: fd,
					async:true,
					success: function (data) {
						console.log(data);
						c=false;
						//location = window.location;
					}
				});
				$(".box.box-dynamic").addClass("box-delete");
				setTimeout(function(){div.remove()},600);
			})
		})
		body.append(div);
	}
	/* 发布动态 */
	$("button.SearchBar-button").click(function(){
		if ($.if_login()) {
			$.dynamicDIV();
		} else{
			$.loginDIV();
		}
	})
	/* 页面滚动事件 */
	$(window).scroll(function(){
		let scrollTop=$(document).scrollTop()||$(window).scrollTop();  
		let header = $("header");
		if(scrollTop*1>0){
			
			header.addClass("is-fixed").css({"width":"100%","top":"0"});
			if(header.next()===null||typeof header.next()=='undefined'||header.next().length===0){
				header.parent().append(
					$("<div class='holder' style='position: relative;inset: 0px; display: block; float: none; margin: 0px; height: 60px;'></div>"));
			}
		}else{
			header.parent().children().eq(1).remove();
		   	header.removeClass("is-fixed").css({"width":"","top":""});
		}
		if (scrollTop*1>$(window).height()/2) {
			$("#base .backtop").addClass("backtop--hiden");
		} else{
			$("#base .backtop").removeClass("backtop--hiden");
		}
	})
	/* 页面回滚 */
	$("#base .backtop").click(function () {
		$("html,body").animate({scrollTop: 0}, 1000);
	})
})();
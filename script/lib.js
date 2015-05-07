(function($) {
    /*
     * 加载动画方法
     *  @block       动画浮层dom  默认为body
     */
    window.loadingBox = function(block) {
        var close;
        if (!block) {
            block = $('body');
        }
        if (block.is('a')) {
            block.addClass('disabled');
            close = function() {
                block.removeClass('disabled');
            };
        } else if (block.is('body')) {
            if (!$('#loadingBox').length) {
                block.append('<div class="loadingBox" id="loadingBox"><div class="cloud"><i class="loadingImg"></i><span class="msg">加载中...</span></div></div>');
            }
            var loadingBoxEle = $('#loadingBox').show();
            // var width = $(window).innerWidth();
            // var height = $(window).innerHeight();
            loadingBoxEle.show();

            close = function() {
                setTimeout(function() {
                    loadingBoxEle.hide();
                }, 0);

            };
        } else {
            var loadingBoxEle;
            if (block.children('.loadingBox').length) {
                loadingBoxEle = block.children('.loadingBox');
            } else {
                loadingBoxEle = $('<div class="loadingBox"><div class="cloud"></div></div>').appendTo(block);
            }
            block.css('position: relative');
            loadingBoxEle.css({
                top: 0,
                left: 0,
                position: 'absolute'
            }).show();
            close = function() {
                setTimeout(function() {
                    loadingBoxEle.hide();
                }, 0);

            };
        }
        return {
            close: close
        };
    };

    window.loadImg = function(src, callback) {
        var Img = new Image();
        Img.src = src;
        Img.onload = function(obj) {
            callback(Img);
        };
        Img.onerror = function(obj) {
            callback(Img);
        };
    };
    //得到数组索引
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                return i;
            }
        }
        return -1;
    };
    //数组删除单元素
    Array.prototype.removevalue = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    //数组删除根据索引
    Array.prototype.remove = function(dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i];
            }
        }
        this.length -= 1;
    };
    //数组删除多元素
    Array.prototype.removeByArray = function(dx) {
        if (!dx.length || typeof dx !== 'object' || dx.length > this.length) return false;
        var arr = [];
        for (var i = 0; i < dx.length; i++) {
            var index = this.indexOf(dx[i]);
            if (index > -1) {
                this.remove(index);
            }
        }
    };

    $.extend($, {
        /* 调用并绑定ajax方法，添加必定效果
         * @setting    jquery ajax方法对象
         * @others     其他方法对象
         * @stringify  bool 是否stringify数据，及添加contentType
         */
        ajaxBind: function(setting, others, stringify) {
            var opts = $.extend({
                type: 'GET',
                //dataType: 'json', // json
                //jsonp: Base.CALLBACK, // base include
                cache: false,
                data: {}
            }, setting);

            setting = $.extend({
                loading: true,
                msgArea: null,
                stringify: false,
                onBegin: null,
                successMsg: '',
                onSuccess: null,
                errorMsg: '',
                noStateFuc: null,
                onError: null
            }, others);

            var loadingArea = null,
                loading = new Object(),
                ajaxOpts = new Object();
            if (typeof setting.onBegin === 'function') {
                setting.onBegin();
            }
            // if (setting.loading) {
            //  loadingArea = setting.loading || $this.closest('div');
            //  ajaxOpts.beforeSend = function() {
            //      loading = loadingBox(loadingArea);
            //  };
            // }

            opts.type = opts.type.toUpperCase();

            if (opts.type !== 'GET' && setting.stringify) {
                if (opts.type != 'GET' && opts.data) {
                    opts.data = $.stringify(opts.data);
                }
                opts.contentType = 'text/html; charset=utf-8';
                opts.processData = false;
            }
            // if (opts.type == 'GET' && (/\{*\}/).test(opts.url)) {
            //     $.extend(opts, rewrite(opts.url, opts.data));
            // }
            if (opts.type === 'PUT' || opts.type === 'DELETE') {
                opts.data._method = opts.type;
                opts.type = 'POST';
            }

            opts.beforeSend = function() {
                if (setting.loading) {
                    var loadingArea = typeof setting.loading === 'object' ? setting.loading : $('body');
                    loading = loadingBox(loadingArea);
                } else {
                    loading = {
                        close: function() {}
                    };
                }
            };
            opts.error = function(backData) {
                loading.close();
                typeof setting.onError === 'function' ? setting.onError(backData) : '';
                if (BASE.openRule) {
                    // window.location.href = '/other/error.html'; // 测试阶段暂时关闭
                } else {
                    var msg = backData.statusText + ' status:' + backData.status;
                    setTimeout(function() {
                        handlerError(msg);
                    }, 500);
                }
            };
            opts.success = function(data) {
                loading.close();
                if (typeof data === 'string') {
                    data = $.parseJSON(data);
                }
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }

                if (data.result === 0) {
                    //onSuccess
                    $.isFunction(others.onSuccess) ? others.onSuccess(data, opts.data) : '';
                    //缓存
                    if (opts.cache) {
                        if (!Base.ajaxGetArray) BASE.ajaxGetArray = {};
                        BASE.ajaxGetArray[opts.url] = data;
                        BASE.ajaxGetArray[opts.url].cacheData = true;
                    }
                } else {
                    //onError
                    if (setting.onError) setting.onError(data);
                    if (data.result === 999) {
                        showLogin();
                    } else if (data.result === 404 || data.result === 500) {
                        setTimeout(function() {
                            handlerError(data.message || data.result.message);
                        }, 500);
                    } else {
                        setTimeout(function() {
                            handlerError(data.message || data.result.message);
                        }, 500);
                    }
                }
            };
            if (opts.cache && BASE.ajaxGetArray && BASE.ajaxGetArray[opts.url]) {
                var cacheData = BASE.ajaxGetArray[opts.url];
                $.isFunction(others.onSuccess) ? others.onSuccess(cacheData, opts.data) : '';
            } else {
                opts.url = opts.url;
                $.ajax(opts);
            }

            function handlerError(msg) {
                var timer;
                if (setting.msgArea) {
                    if (msg === setting.msgArea.text() && setting.msgArea.is(':visible')) return;
                    timer = setTimeout(function() {
                        setting.msgArea.fadeOut(1000);
                    }, 5000);
                    setting.msgArea.html(msg + '<i class="re"></i>').show();
                    setting.msgArea.find('.re').on('click', function() {
                        setting.msgArea.fadeOut(200);
                        clearTimeout(timer);
                    });

                } else {
                    $.alert(msg);
                }
            }
        },
        /*
         * stringify方法，stringify对象为字符串，兼容不支持JSON的浏览器
         */
        stringify: function(obj) { //$.parseJSON() is available in jQuery1.4+; 
            if ("JSON" in window) return JSON.stringify(obj);
            var t = typeof(obj);
            if (t != "object" || obj === null) {
                if (t == "string") obj = '"' + obj + '"';
                return String(obj);
            } else {
                var n, v, json = [],
                    arr = (obj && obj.constructor == Array);
                for (n in obj) {
                    v = obj[n];
                    t = typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t == "string") {
                            v = '"' + v + '"';
                        } else if (t == "object" && v !== null) {
                            v = jQuery.stringify(v);
                        }
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        },
        lightbox: function(setting, $thisele) {
            /*
             * @target     模板存放位置
             * @className  需要给lightbox添加的class
             * @type       弹出层type，可预设type class来切换主题
             * @shade      背景层true false
             * @width      弹出层宽度
             * @afterShow  弹出层创建完成回调方法(stage:stage层)
             * @cache      是否缓存
             * @isCloseBtn 是否有close Btn
             * @onClose    关闭弹出层时回调(ele.stage, $thisele, this)
             */
            var opts = $.extend({
                target: null,
                className: '',
                type: 'pop',
                shade: true,
                width: 14,
                afterShow: undefined,
                cache: false,
                isTitle: true,
                shadowClose: true,
                onShadowClose: null,
                isCloseBtn: true,
                title: '标题',
                shadowClose: true,
                onClose: undefined,
                onRemove: undefined
            }, setting);

            if ($('#lightbox').length) return false;
            var loginWrap = $('#loginWrap');


            var theBox = new box();
            theBox.show();

            return theBox;

            function box() {
                var thebox = this;
                var ele = {
                    box: $('#lightbox'),
                    shade: $('#shade')
                };
                if (!ele.box.length) {
                    ele.box = $('<div id="lightbox" class="lightbox ' + (opts.className || '') + '"></div>');
                    ele.shade = BASE.rootMask;
                    if (opts.isTitle) {
                        ele.title = $('<div class="boxTitle"><span class="boxName"><em>' + opts.title + '</em><i></i></span><a href="#" class="close iconfont icon-close1"></a></div>').appendTo(ele.box);
                    }
                    ele.stage = $('<div class="stage"></div>').appendTo(ele.box);
                    $('body').append(ele.shade).append(ele.box);
                    if(opts.shadowClose){
                        ele.shade.off('tap.light').on('tap.light', function() {
                            thebox.close();
                        });
                    }
                    
                } else {
                    ele.stage = BASE.rootMask;
                    ele.title = ele.box.children('.boxTitle');
                }
                if (opts.isTitle) {
                    if (opts.isCloseBtn) {
                        var closeBtn = ele.title.children('.close');
                        closeBtn.on('click', function() {
                            thebox.close();
                            return false;
                        });
                    } else {
                        ele.title.children('.close').hide();
                    }
                }

                if(opts.shadowClose){
                    ele.shade.on('tap', function(){
                        thebox.close();
                        if(opts.onShadowClose){
                            opts.onShadowClose();
                        }
                        return false;
                    });
                }


                this.init = function() {
                    ele.box.css({
                        // width: opts.width + 'rem',
                        // left: (16 - opts.width) / 2 +'rem'
                    }).addClass('lightbox' + opts.type);
                };
                this.show = function() {
                    this.init();
                    loginWrap.css('z-index', 10);
                    if (opts.shade) {
                        ele.shade.show();
                    }
                    if (opts.target && opts.target.length) {
                        this.targetBox = opts.target.parent();
                        if (!opts.cache) {
                            this.targetBox.data('temp', this.targetBox.html());
                        }
                        opts.target.appendTo(ele.stage);
                    }
                    ele.box.show();
                    // HS.msgBox.parent().addClass('lightboxMsg').hide();
                    if (opts.afterShow) opts.afterShow(ele.stage, this, $thisele);

                    //ele.stage.find('[type="text"]').not('[disabled="disabled"],[readonly="true"]').first().focus();

                    var stageH = getHiddenBoxHeight(ele.box);
                    // ele.box.css({
                    //     marginTop: -stageH / 2
                    // });

                    // ele.box.find('.cancel').on('click', function() {
                    //     thebox.close();
                    // });
                };
                this.close = function() {
                    ele.box.addClass('fadeOutBottom');
                    setTimeout(function() {
                        ele.box.remove();
                        ele.shade.hide();
                        typeof opts.onRemove === 'function' ? opts.onRemove() : '';
                        loginWrap.css('z-index', '');
                    }, 400);
                    if (opts.onClose) opts.onClose(ele.stage, $thisele, this);
                    if (!opts.target) {
                        //ele.stage.html('');
                    } else if (!opts.cache) {
                        if (this.targetBox) this.targetBox.html(this.targetBox.data('temp'));
                        //ele.stage.html('');
                    } else {
                        ele.stage.children().appendTo(this.targetBox || 'body');
                    }
                };
            }

            function getHiddenBoxHeight(ele) {
                var isHidden = ele.css('display') === 'none';
                
                // ele.css({
                //     maxHeight: $(window).height() - 60
                // }).show();
                var height = ele.height();
                if (isHidden) ele.hide();
                return height;
            }
        },
        /*
         * 替代系统alert方法
         * @message alert的text内容
         * @type    alert的type ('success' || 'error')
         */
        alert: function(message, hideTime) {
            var alertBox = $('<div class="alert-plug">'+message+'</div>');
            alertBox.appendTo('body');
            setTimeout(function(){
                alertBox.addClass('fadeOut');
                setTimeout(function(){
                    alertBox.remove();
                }, 400);
            }, hideTime || 2000);
        },
        confirm: function(text, callback) {
            var confirmHtml = '<div class="confirm-main">' +
                '<div class="confirm-message">' +
                '<p>' + text + '</p>' +
                '</div>' +
                '<div class="alert_btn">' +
                '<a href="javascript:" class="si-button confirm">确定</a>' +
                '<a href="javascript:" class="si-button cancel">取消</a>' +
                '</div>' +
                '</div>';

            var light = $.lightbox({
                className: 'si-wind',
                title: '确认',
                onShadowClose: function() {
                    if (typeof callback === 'function') callback(false);
                },
                afterShow: function(stage) {
                    stage.append(confirmHtml);
                    stage.find('.confirm').on('tap', function() {
                        light.close();
                        if (typeof callback === 'function') callback(true);
                        return false;
                    });
                    stage.find('.cancel').on('tap', function() {
                        if (typeof callback === 'function') callback(false);
                        light.close();
                        return false;
                    });
                }
            });
        },
        makeArray: function( a ) {
            var r = [];

            // Need to use typeof to fight Safari childNodes crashes
            if ( typeof a != "array" )
                for ( var i = 0, al = a.length; i < al; i++ )
                    r.push( a[i] );
            else
                r = a.slice( 0 );

            return r;
        }
    });
    $.extend($.fn, {
        lightbox: function(setting) {

            if (!this.length) return this;
            /*dom直接绑定lightbox方法
             * 参数方法同jquery lightbox原型扩展参数
             */
            var opt = {
                target: null,
                className: '',
                type: 'pop',
                shade: true,
                isTitle: true,
                width: 800,
                afterShow: undefined,
                cache: false,
                isCloseBtn: true,
                onClose: undefined
            };

            return this.each(function() {
                var opts = $.extend({}, opt, setting);
                var self = this;
                $(this).on('click', function() {

                    opts.target = opt.target || ($(this).data('target') ? $($(this).data('target')) : null);
                    var light = $.lightbox(opts, $(this));
                    self.close = light.close;
                    return false;
                });
            });
        },
        ajaxBind: function(ajaxSetting, others) {
            // 表单 data 生成 依赖于 jquery.form_params.js
            others = others || {};
            ajaxSetting = ajaxSetting || {};

            if (this.length) {
                this.each(function() {
                    var $this = $(this),
                        isForm = $this.attr('action') ? true : false,
                        isA = $this.is('a');

                    var funs = {
                        onBegin: null,
                        onSuccess: null,
                        onError: null
                    };
                    var ajaxOpts = {
                        type: isForm ? $this.attr('method').toUpperCase() : 'GET'
                    };

                    var setting = $.extend({
                        loading: true,
                        stringify: false,
                        type: isForm ? 'submit' : tab,
                        onBegin: null,
                        successMsg: '',
                        onSuccess: null,
                        errorMsg: '',
                        onError: null,
                        msgArea: null
                    }, others);

                    



                    if (setting.type === 'auto') {
                        ajaxSettingExtend(setting.onBegin);
                        $.ajaxBind(ajaxOpts, setting, setting.stringify);
                    } else if(isForm) {
                        $this.on(setting.type, function() {
                            ajaxSettingExtend(setting.onBegin)
                            $.ajaxBind(ajaxOpts, setting, setting.stringify);
                            return false;
                        });
                    } else {
                        ajaxSettingExtend(setting.onBegin);
                        $this.on(setting.type, function() {
                            $.ajaxBind(ajaxOpts, setting, setting.stringify);
                            return false;
                        });
                    }

                    function ajaxSettingExtend(onBegin) {
                        ajaxOpts = $.extend(ajaxOpts, ajaxSetting);
                        ajaxOpts.type = ajaxOpts.type.toUpperCase();
                        var onBeginResult = (!onBegin || onBegin(ajaxOpts.data, $this));
                        if (onBeginResult) {
                            if (ajaxSetting.data) {
                                ajaxOpts.data = typeof ajaxSetting.data == 'function' ? ajaxSetting.data($this) : ajaxSetting.data;
                            } else if (isForm) {
                                ajaxOpts.data = $this.formParams(false);
                            }
                            if (ajaxSetting.url) {
                                ajaxOpts.url = typeof(ajaxSetting.url) == 'function' ? ajaxSetting.url($this) : ajaxSetting.url;
                            } else {
                                ajaxOpts.url = isForm ? $this.attr('action') : (isA ? $this.attr('href') : $this.data('remote'));
                            }
                        }
                        return onBeginResult;
                    }
                });
            }
            return this;
        },
        formParams: function(convert, writeDepend) {
            /**
             * @parent dom
             * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/form_params/form_params.js
             * @plugin jquery/dom/form_params
             * @test jquery/dom/form_params/qunit.html
             * <p>Returns an object of name-value pairs that represents values in a form.
             * It is able to nest values whose element's name has square brackets. </p>
             * Example html:
             * @codestart html
             * &lt;form>
             *   &lt;input name="foo[bar]" value='2'/>
             *   &lt;input name="foo[ced]" value='4'/>
             * &lt;form/>
             * @codeend
             * Example code:
             * @codestart
             * $('form').formParams() //-> { foo:{bar:2, ced: 4} }
             * @codeend
             *
             * @demo jquery/dom/form_params/form_params.html
             *
             * @param {Boolean} [convert] True if strings that look like numbers and booleans should be converted.  Defaults to true.
             * @return {Object} An object of name-value pairs.
             */
            if (this[0].nodeName.toLowerCase() == 'form' && this[0].elements) {
                return $($.makeArray(this[0].elements)).getParams(convert, writeDepend);
            }
            return $("input[name], textarea[name], select[name]", this[0]).getParams(convert, writeDepend);
        },
        getParams: function(convert, writeDepend) {
            var data = {},
                current;

            convert = convert === undefined ? true : convert;

            this.each(function() {
                var el = this,
                    type = el.type && el.type.toLowerCase();
                //if we are submit, ignore
                if ((type == 'submit') || (type == 'file') || !el.name) {
                    return;
                }
                var radioCheck = /radio|checkbox/i,
                    keyBreaker = /[^\[\]]+/g,
                    numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;
                var isNumber = function(value) {
                    if (Number(value) == value && !isNaN(parseFloat(value))) return true;
                    if (typeof value != 'string') return false;
                    return value.match(numberMatcher);
                };
                var key = el.name,
                    value = $(el).data("value") || $.fn.val.call([el]),
                    isRadioCheck = radioCheck.test(el.type),
                    parts = key.match(keyBreaker),
                    write = !isRadioCheck || !!el.checked,
                    //make an array of values
                    lastPart;

                if (convert) {
                    if (isNumber(value)) {
                        value = parseFloat(value);
                    } else if (value === 'true' || value === 'false') {
                        value = Boolean(value);
                    }
                }
                // value = value.replaceAll(/\</g,'&lt;');
                // value = value.replaceAll(/\>/g,'&gt;');
                // value = value.replaceAll(/\&/g,'&amp;');
                // value = value.replaceAll(/\\/g,'&quot;');
                // value = value.replaceAll(/\\t/g,'&nbsp;&nbsp;');
                // value = value.replaceAll(/\ /g,'&nbsp;');

                // go through and create nested objects
                current = data;
                for (var i = 0; i < parts.length - 1; i++) {
                    if (!current[parts[i]]) {
                        // Riant 20131202 Edited - For [NUMBER] array support
                        // current[parts[i]] = {};
                        var isArrayChild = i + 1 <= parts.length - 1 && isNumber(parts[i + 1]);
                        current[parts[i]] = isArrayChild ? [] : {};
                        // Edited END
                    }
                    current = current[parts[i]];
                }
                lastPart = parts[parts.length - 1];
                if (writeDepend && write && $.isFunction(writeDepend)) write = writeDepend(lastPart, current);

                //now we are on the last part, set the value
                if (type === "checkbox" && !$(el).is('.SC')) {
                    if (lastPart in current) {
                        // if (!$.isArray(current[lastPart]) ) {
                        //     current[lastPart] = current[lastPart] === undefined ? [] : [current[lastPart]];
                        // }
                        if (write) {
                            current[lastPart].push(value);
                        }
                    } else {
                        current[lastPart] = write ? [value] : [];
                    }
                } else if (write || !current[lastPart]) {
                    // current[lastPart] = write ? value : undefined;
                    if (write) current[lastPart] = value;
                }
            });
            return data;
        }
    });
})(Zepto);

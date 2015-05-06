(function (t) {
    t.extend(t.fn, {
        validate: function (e) {
            if (!this.length) return e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."),
                void 0;
            var i = t.data(this[0], "validator");
            return i ? i : (this.attr("novalidate", "novalidate"), i = new t.validator(e, this[0]), t.data(this[0], "validator", i), i.settings.onsubmit && (this.validateDelegate(":submit", "click",
                function (e) {
                    i.settings.submitHandler && (i.submitButton = e.target),
                    t(e.target).hasClass("cancel") && (i.cancelSubmit = !0),
                    void 0 !== t(e.target).attr("formnovalidate") && (i.cancelSubmit = !0)
                }), this.submit(function (e) {
                function s() {
                    var s;
                    return i.settings.submitHandler ? (i.submitButton && (s = t("<input type='hidden'/>").attr("name", i.submitButton.name).val(t(i.submitButton).val()).appendTo(i.currentForm)), i.settings.submitHandler.call(i, i.currentForm, e), i.submitButton && s.remove(), !1) : !0
                };
                return i.settings.debug && e.preventDefault(),
                    i.cancelSubmit ? (i.cancelSubmit = !1, s()) : i.form() ? i.pendingRequest ? (i.formSubmitted = !0, !1) : s() : (i.focusInvalid(), !1)
            })), i)
        },
        valid: function () {
            if (t(this[0]).is("form")) return this.validate().form();
            var e = !0,
                i = t(this[0].form).validate();
            return this.each(function () {
                e = e && i.element(this)
            }),
                e
        },
        removeAttrs: function (e) {
            var i = {},
                s = this;
            return t.each(e.split(/\s/),
                function (t, e) {
                    i[e] = s.attr(e),
                        s.removeAttr(e)
                }),
                i
        },
        rules: function (e, i) {
            var s = this[0];
            if (e) {
                var r = t.data(s.form, "validator").settings,
                    n = r.rules,
                    a = t.validator.staticRules(s);
                switch (e) {
                    case "add":
                        t.extend(a, t.validator.normalizeRule(i)),
                            delete a.messages,
                            n[s.name] = a,
                        i.messages && (r.messages[s.name] = t.extend(r.messages[s.name], i.messages));
                        break;
                    case "remove":
                        if (!i) return delete n[s.name],
                            a;
                        var u = {};
                        return t.each(i.split(/\s/),
                            function (t, e) {
                                u[e] = a[e],
                                    delete a[e]
                            }),
                            u
                }
            }
            ;
            var o = t.validator.normalizeRules(t.extend({},
                t.validator.classRules(s), t.validator.attributeRules(s), t.validator.dataRules(s), t.validator.staticRules(s)), s);
            if (o.required) {
                var l = o.required;
                delete o.required,
                    o = t.extend({
                            required: l
                        },
                        o)
            }
            ;
            return o
        }
    }),
        t.extend(t.expr[":"], {
            blank: function (e) {
                return !t.trim("" + t(e).val())
            },
            filled: function (e) {
                return !!t.trim("" + t(e).val())
            },
            unchecked: function (e) {
                return !t(e).prop("checked")
            }
        }),
        t.validator = function (e, i) {
            this.settings = t.extend(!0, {},
                t.validator.defaults, e),
                this.currentForm = i,
                this.init()
        },
        t.validator.format = function (e, i) {
            return 1 === arguments.length ?
                function () {
                    var i = t.makeArray(arguments);
                    return i.unshift(e),
                        t.validator.format.apply(this, i)
                } : (arguments.length > 2 && i.constructor !== Array && (i = t.makeArray(arguments).slice(1)), i.constructor !== Array && (i = [i]), t.each(i,
                function (t, i) {
                    e = e.replace(new RegExp("\\{" + t + "\\}", "g"),
                        function () {
                            return i
                        })
                }), e)
        },
        t.extend(t.validator, {
            defaults: {
                messages: {},
                groups: {},
                rules: {},
                errorClass: "error",
                validClass: "valid",
                errorElement: "label",
                focusInvalid: !0,
                errorContainer: t([]),
                errorLabelContainer: t([]),
                onsubmit: !0,
                ignore: ":hidden",
                ignoreTitle: !1,
                onfocusin: function (t) {
                    this.lastActive = t,
                    this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, t, this.settings.errorClass, this.settings.validClass), this.addWrapper(this.errorsFor(t)).hide())
                },
                onfocusout: function (t) {
                    this.checkable(t) || !(t.name in this.submitted) && this.optional(t) || this.element(t)
                },
                onkeyup: function (t, e) {
                    (9 !== e.which || "" !== this.elementValue(t)) && (t.name in this.submitted || t === this.lastElement) && this.element(t)
                },
                onclick: function (t) {
                    t.name in this.submitted ? this.element(t) : t.parentNode.name in this.submitted && this.element(t.parentNode)
                },
                highlight: function (e, i, s) {
                    "radio" === e.type ? this.findByName(e.name).addClass(i).removeClass(s) : t(e).addClass(i).removeClass(s)
                },
                unhighlight: function (e, i, s) {
                    "radio" === e.type ? this.findByName(e.name).removeClass(i).addClass(s) : t(e).removeClass(i).addClass(s)
                }
            },
            setDefaults: function (e) {
                t.extend(t.validator.defaults, e)
            },
            messages: {
                required: "This field is required.",
                remote: "Please fix this field.",
                email: "Please enter a valid email address.",
                url: "Please enter a valid URL.",
                date: "Please enter a valid date.",
                dateISO: "Please enter a valid date (ISO).",
                number: "Please enter a valid number.",
                digits: "Please enter only digits.",
                creditcard: "Please enter a valid credit card number.",
                equalTo: "Please enter the same value again.",
                maxlength: t.validator.format("Please enter no more than {0} characters."),
                minlength: t.validator.format("Please enter at least {0} characters."),
                rangelength: t.validator.format("Please enter a value between {0} and {1} characters long."),
                range: t.validator.format("Please enter a value between {0} and {1}."),
                max: t.validator.format("请输入小于等于{0}的正数."),
                min: t.validator.format("请输入不小于{0}的正数.")
            },
            autoCreateRanges: !1,
            prototype: {
                init: function () {
                    function e(e) {
                        var i = t.data(this[0].form, "validator"),
                            s = "on" + e.type.replace(/^validate/, "");
                        i.settings[s] && i.settings[s].call(i, this[0], e)
                    };
                    this.labelContainer = t(this.settings.errorLabelContainer),
                        this.errorContext = this.labelContainer.length && this.labelContainer || t(this.currentForm),
                        this.containers = t(this.settings.errorContainer).add(this.settings.errorLabelContainer),
                        this.submitted = {},
                        this.valueCache = {},
                        this.pendingRequest = 0,
                        this.pending = {},
                        this.invalid = {},
                        this.reset();
                    var i = this.groups = {};
                    t.each(this.settings.groups,
                        function (e, s) {
                            "string" == typeof s && (s = s.split(/\s/)),
                                t.each(s,
                                    function (t, s) {
                                        i[s] = e
                                    })
                        });
                    var s = this.settings.rules;
                    t.each(s,
                        function (e, i) {
                            s[e] = t.validator.normalizeRule(i)
                        }),
                        t(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", e).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", e),
                    this.settings.invalidHandler && t(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler)
                },
                form: function () {
                    return this.checkForm(),
                        t.extend(this.submitted, this.errorMap),
                        this.invalid = t.extend({},
                            this.errorMap),
                    this.valid() || t(this.currentForm).triggerHandler("invalid-form", [this]),
                        this.showErrors(),
                        this.valid()
                },
                checkForm: function () {
                    this.prepareForm();
                    for (var t = 0,
                             e = this.currentElements = this.elements(); e[t]; t++) this.check(e[t]);
                    return this.valid()
                },
                element: function (e) {
                    e = this.validationTargetFor(this.clean(e)),
                        this.lastElement = e,
                        this.prepareElement(e),
                        this.currentElements = t(e);
                    var i = this.check(e) !== !1;
                    return i ? delete this.invalid[e.name] : this.invalid[e.name] = !0,
                    this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)),
                        this.showErrors(),
                        i
                },
                showErrors: function (e) {
                    if (e) {
                        t.extend(this.errorMap, e),
                            this.errorList = [];
                        for (var i in e) this.errorList.push({
                            message: e[i],
                            element: this.findByName(i)[0]
                        });
                        this.successList = t.grep(this.successList,
                            function (t) {
                                return !(t.name in e)
                            })
                    }
                    ;
                    this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
                },
                resetForm: function () {
                    t.fn.resetForm && t(this.currentForm).resetForm(),
                        this.submitted = {},
                        this.lastElement = null,
                        this.prepareForm(),
                        this.hideErrors(),
                        this.elements().removeClass(this.settings.errorClass).removeData("previousValue")
                },
                numberOfInvalids: function () {
                    return this.objectLength(this.invalid)
                },
                objectLength: function (t) {
                    var e = 0;
                    for (var i in t) e++;
                    return e
                },
                hideErrors: function () {
                    this.addWrapper(this.toHide).hide()
                },
                valid: function () {
                    return 0 === this.size()
                },
                size: function () {
                    return this.errorList.length
                },
                focusInvalid: function () {
                    if (this.settings.focusInvalid) try {
                        t(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                    } catch (e) {
                    }
                },
                findLastActive: function () {
                    var e = this.lastActive;
                    return e && 1 === t.grep(this.errorList,
                            function (t) {
                                return t.element.name === e.name
                            }).length && e
                },
                elements: function () {
                    var e = this,
                        i = {};
                    return t(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () {
                        return !this.name && e.settings.debug && window.console && console.error("%o has no name assigned", this),
                            this.name in i || !e.objectLength(t(this).rules()) ? !1 : (i[this.name] = !0, !0)
                    })
                },
                clean: function (e) {
                    return t(e)[0]
                },
                errors: function () {
                    var e = this.settings.errorClass.replace(" ", ".");
                    return t(this.settings.errorElement + "." + e, this.errorContext)
                },
                reset: function () {
                    this.successList = [],
                        this.errorList = [],
                        this.errorMap = {},
                        this.toShow = t([]),
                        this.toHide = t([]),
                        this.currentElements = t([])
                },
                prepareForm: function () {
                    this.reset(),
                        this.toHide = this.errors().add(this.containers)
                },
                prepareElement: function (t) {
                    this.reset(),
                        this.toHide = this.errorsFor(t)
                },
                elementValue: function (e) {
                    var i = t(e).attr("type"),
                        s = t(e).val();
                    return "radio" === i || "checkbox" === i ? t("input[name='" + t(e).attr("name") + "']:checked").val() : "string" == typeof s ? s.replace(/\r/g, "") : s
                },
                check: function (e) {
                    e = this.validationTargetFor(this.clean(e));
                    var i, s = t(e).rules(),
                        r = !1,
                        n = this.elementValue(e);
                    for (var a in s) {
                        var u = {
                            method: a,
                            parameters: s[a]
                        };
                        try {
                            if (i = t.validator.methods[a].call(this, n, e, u.parameters), "dependency-mismatch" === i) {
                                r = !0;
                                continue
                            }
                            ;
                            if (r = !1, "pending" === i) return this.toHide = this.toHide.not(this.errorsFor(e)),
                                void 0;
                            if (!i) return this.formatAndAdd(e, u), !1
                        } catch (o) {
                            throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + e.id + ", check the '" + u.method + "' method.", o),
                                o
                        }
                    }
                    ;
                    return r ? void 0 : (this.objectLength(s) && this.successList.push(e), !0)
                },
                customDataMessage: function (e, i) {
                    return t(e).data("msg-" + i.toLowerCase()) || e.attributes && t(e).attr("data-msg-" + i.toLowerCase())
                },
                customMessage: function (t, e) {
                    var i = this.settings.messages[t];
                    return i && (i.constructor === String ? i : i[e])
                },
                findDefined: function () {
                    for (var t = 0; t < arguments.length; t++)
                        if (void 0 !== arguments[t]) return arguments[t];
                    return void 0
                },
                defaultMessage: function (e, i) {
                    return this.findDefined(this.customMessage(e.name, i), this.customDataMessage(e, i), !this.settings.ignoreTitle && e.title || void 0, t.validator.messages[i], "<strong>Warning: No message defined for " + e.name + "</strong>")
                },
                formatAndAdd: function (e, i) {
                    var s = this.defaultMessage(e, i.method),
                        r = /\$?\{(\d+)\}/g;
                    "function" == typeof s ? s = s.call(this, i.parameters, e) : r.test(s) && (s = t.validator.format(s.replace(r, "{$1}"), i.parameters)),
                        this.errorList.push({
                            message: s,
                            element: e
                        }),
                        this.errorMap[e.name] = s,
                        this.submitted[e.name] = s
                },
                addWrapper: function (t) {
                    return this.settings.wrapper && (t = t.add(t.parent(this.settings.wrapper))),
                        t
                },
                defaultShowErrors: function () {
                    var t, e;
                    for (t = 0; this.errorList[t]; t++) {
                        var i = this.errorList[t];
                        this.settings.highlight && this.settings.highlight.call(this, i.element, this.settings.errorClass, this.settings.validClass),
                            this.showLabel(i.element, i.message)
                    }
                    ;
                    if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
                        for (t = 0; this.successList[t]; t++) this.showLabel(this.successList[t]);
                    if (this.settings.unhighlight)
                        for (t = 0, e = this.validElements(); e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, this.settings.validClass);
                    this.toHide = this.toHide.not(this.toShow),
                        this.hideErrors(),
                        this.addWrapper(this.toShow).show()
                },
                validElements: function () {
                    return this.currentElements.not(this.invalidElements())
                },
                invalidElements: function () {
                    return t(this.errorList).map(function () {
                        return this.element
                    })
                },
                showLabel: function (e, i) {
                    var s = this.errorsFor(e);
                    s.length ? (s.removeClass(this.settings.validClass).addClass(this.settings.errorClass), s.html('<i></i>' + i)) : (s = t("<" + this.settings.errorElement + ">").attr("for", this.idOrName(e)).addClass(this.settings.errorClass).html(i || ""), this.settings.wrapper && (s = s.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.append(s).length || (this.settings.errorPlacement ? this.settings.errorPlacement(s, t(e)) : s.insertAfter(e))), !i && this.settings.success && (s.text(""), "string" == typeof this.settings.success ? s.addClass(this.settings.success) : this.settings.success(s, e)),
                        this.toShow = this.toShow.add(s)
                },
                errorsFor: function (e) {
                    var i = this.idOrName(e);
                    return this.errors().filter(function () {
                        return t(this).attr("for") === i
                    })
                },
                idOrName: function (t) {
                    return this.groups[t.name] || (this.checkable(t) ? t.name : t.id || t.name)
                },
                validationTargetFor: function (t) {
                    return this.checkable(t) && (t = this.findByName(t.name).not(this.settings.ignore)[0]),
                        t
                },
                checkable: function (t) {
                    return /radio|checkbox/i.test(t.type)
                },
                findByName: function (e) {
                    return t(this.currentForm).find("[name='" + e + "']")
                },
                getLength: function (e, i) {
                    switch (i.nodeName.toLowerCase()) {
                        case "select":
                            return t("option:selected", i).length;
                        case "input":
                            if (this.checkable(i)) return this.findByName(i.name).filter(":checked").length
                    }
                    ;
                    return e.length
                },
                depend: function (t, e) {
                    return this.dependTypes[typeof t] ? this.dependTypes[typeof t](t, e) : !0
                },
                dependTypes: {
                    "boolean": function (t) {
                        return t
                    },
                    string: function (e, i) {
                        return !!t(e, i.form).length
                    },
                    "function": function (t, e) {
                        return t(e)
                    }
                },
                optional: function (e) {
                    var i = this.elementValue(e);
                    return !t.validator.methods.required.call(this, i, e) && "dependency-mismatch"
                },
                startRequest: function (t) {
                    this.pending[t.name] || (this.pendingRequest++, this.pending[t.name] = !0)
                },
                stopRequest: function (e, i) {
                    this.pendingRequest--,
                    this.pendingRequest < 0 && (this.pendingRequest = 0),
                        delete this.pending[e.name],
                        i && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (t(this.currentForm).submit(), this.formSubmitted = !1) : !i && 0 === this.pendingRequest && this.formSubmitted && (t(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
                },
                previousValue: function (e) {
                    return t.data(e, "previousValue") || t.data(e, "previousValue", {
                            old: null,
                            valid: !0,
                            message: this.defaultMessage(e, "remote")
                        })
                }
            },
            classRuleSettings: {
                required: {
                    required: !0
                },
                email: {
                    email: !0
                },
                url: {
                    url: !0
                },
                date: {
                    date: !0
                },
                dateISO: {
                    dateISO: !0
                },
                number: {
                    number: !0
                },
                digits: {
                    digits: !0
                },
                creditcard: {
                    creditcard: !0
                }
            },
            addClassRules: function (e, i) {
                e.constructor === String ? this.classRuleSettings[e] = i : t.extend(this.classRuleSettings, e)
            },
            classRules: function (e) {
                var i = {},
                    s = t(e).attr("class");
                return s && t.each(s.split(" "),
                    function () {
                        this in t.validator.classRuleSettings && t.extend(i, t.validator.classRuleSettings[this])
                    }),
                    i
            },
            attributeRules: function (e) {
                var i = {},
                    s = t(e),
                    r = s[0].getAttribute("type");
                for (var n in t.validator.methods) {
                    var a;
                    "required" === n ? (a = s.get(0).getAttribute(n), "" === a && (a = !0), a = !!a) : a = s.attr(n),
                    /min|max/.test(n) && (null === r || /number|range|text/.test(r)) && (a = Number(a)),
                        a ? i[n] = a : r === n && "range" !== r && (i[n] = !0)
                }
                ;
                return i.maxlength && /-1|2147483647|524288/.test(i.maxlength) && delete i.maxlength,
                    i
            },
            dataRules: function (e) {
                var i, s, r = {},
                    n = t(e);
                for (i in t.validator.methods) s = n.data("rule-" + i.toLowerCase()),
                void 0 !== s && (r[i] = s);
                return r
            },
            staticRules: function (e) {
                var i = {},
                    s = t.data(e.form, "validator");
                return s.settings.rules && (i = t.validator.normalizeRule(s.settings.rules[e.name]) || {}),
                    i
            },
            normalizeRules: function (e, i) {
                return t.each(e,
                    function (s, r) {
                        if (r === !1) return delete e[s],
                            void 0;
                        if (r.param || r.depends) {
                            var n = !0;
                            switch (typeof r.depends) {
                                case "string":
                                    n = !!t(r.depends, i.form).length;
                                    break;
                                case "function":
                                    n = r.depends.call(i, i)
                            }
                            ;
                            n ? e[s] = void 0 !== r.param ? r.param : !0 : delete e[s]
                        }
                    }),
                    t.each(e,
                        function (s, r) {
                            e[s] = t.isFunction(r) ? r(i) : r
                        }),
                    t.each(["minlength", "maxlength"],
                        function () {
                            e[this] && (e[this] = Number(e[this]))
                        }),
                    t.each(["rangelength", "range"],
                        function () {
                            var i;
                            e[this] && (t.isArray(e[this]) ? e[this] = [Number(e[this][0]), Number(e[this][1])] : "string" == typeof e[this] && (i = e[this].split(/[\s,]+/), e[this] = [Number(i[0]), Number(i[1])]))
                        }),
                t.validator.autoCreateRanges && (e.min && e.max && (e.range = [e.min, e.max], delete e.min, delete e.max), e.minlength && e.maxlength && (e.rangelength = [e.minlength, e.maxlength], delete e.minlength, delete e.maxlength)),
                    e
            },
            normalizeRule: function (e) {
                if ("string" == typeof e) {
                    var i = {};
                    t.each(e.split(/\s/),
                        function () {
                            i[this] = !0
                        }),
                        e = i
                }
                ;
                return e
            },
            addMethod: function (e, i, s) {
                t.validator.methods[e] = i,
                    t.validator.messages[e] = void 0 !== s ? s : t.validator.messages[e],
                i.length < 3 && t.validator.addClassRules(e, t.validator.normalizeRule(e))
            },
            methods: {
                required: function (e, i, s) {
                    if (!this.depend(s, i)) return "dependency-mismatch";
                    if ("select" === i.nodeName.toLowerCase()) {
                        var r = t(i).val();
                        return r && r.length > 0
                    }
                    ;
                    return this.checkable(i) ? this.getLength(e, i) > 0 : t.trim(e).length > 0
                },
                email: function (t, e) {
                    return this.optional(e) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(t)
                },
                url: function (t, e) {
                    return this.optional(e) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t)
                },
                date: function (t, e) {
                    return this.optional(e) || !/Invalid|NaN/.test(new Date(t).toString())
                },
                dateISO: function (t, e) {
                    return this.optional(e) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(t)
                },
                number: function (t, e) {
                    return this.optional(e) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)
                },
                digits: function (t, e) {
                    return this.optional(e) || /^\d+$/.test(t)
                },
                creditcard: function (t, e) {
                    if (this.optional(e)) return "dependency-mismatch";
                    if (/[^0-9 \-]+/.test(t)) return !1;
                    var i = 0,
                        s = 0,
                        r = !1;
                    t = t.replace(/\D/g, "");
                    for (var n = t.length - 1; n >= 0; n--) {
                        var a = t.charAt(n);
                        s = parseInt(a, 10),
                        r && (s *= 2) > 9 && (s -= 9),
                            i += s,
                            r = !r
                    }
                    ;
                    return i % 10 === 0
                },
                minlength: function (e, i, s) {
                    var r = t.isArray(e) ? e.length : this.getLength(t.trim(e), i);
                    return this.optional(i) || r >= s
                },
                maxlength: function (e, i, s) {
                    var r = t.isArray(e) ? e.length : this.getLength(t.trim(e), i);
                    return this.optional(i) || s >= r
                },
                rangelength: function (e, i, s) {
                    var r = t.isArray(e) ? e.length : this.getLength(t.trim(e), i);
                    return this.optional(i) || r >= s[0] && r <= s[1]
                },
                min: function (t, e, i) {
                    return this.optional(e) || t >= i
                },
                max: function (t, e, i) {
                    return this.optional(e) || i >= t
                },
                range: function (t, e, i) {
                    return this.optional(e) || t >= i[0] && t <= i[1]
                },
                equalTo: function (e, i, s) {
                    var r = t(s);
                    return this.settings.onfocusout && r.unbind(".validate-equalTo").bind("blur.validate-equalTo",
                        function () {
                            t(i).valid()
                        }),
                    e === r.val()
                },
                remote: function (e, i, s) {
                    if (this.optional(i)) return "dependency-mismatch";
                    var r = this.previousValue(i);
                    if (this.settings.messages[i.name] || (this.settings.messages[i.name] = {}), r.originalMessage = this.settings.messages[i.name].remote, this.settings.messages[i.name].remote = r.message, s = "string" == typeof s && {
                            url: s
                        } || s, r.old === e) return r.valid;
                    r.old = e;
                    var n = this;
                    this.startRequest(i);
                    var a = {};
                    return a[i.name] = e,
                        t.ajax(t.extend(!0, {
                                url: s,
                                mode: "abort",
                                port: "validate" + i.name,
                                dataType: "json",
                                data: a,
                                success: function (s) {
                                    n.settings.messages[i.name].remote = r.originalMessage;
                                    var a = s === !0 || "true" === s;
                                    if (a) {
                                        var u = n.formSubmitted;
                                        n.prepareElement(i),
                                            n.formSubmitted = u,
                                            n.successList.push(i),
                                            delete n.invalid[i.name],
                                            n.showErrors()
                                    } else {
                                        var o = {},
                                            l = s || n.defaultMessage(i, "remote");
                                        o[i.name] = r.message = t.isFunction(l) ? l(e) : l,
                                            n.invalid[i.name] = !0,
                                            n.showErrors(o)
                                    }
                                    ;
                                    r.valid = a,
                                        n.stopRequest(i, a)
                                }
                            },
                            s)),
                        "pending"
                }
            }
        }),
        t.format = t.validator.format
})(Zepto),
    function (t) {
        var e = {};
        if (t.ajaxPrefilter) t.ajaxPrefilter(function (t, i, s) {
            var r = t.port;
            "abort" === t.mode && (e[r] && e[r].abort(), e[r] = s)
        });
        else {
            var i = t.ajax;
            t.ajax = function (s) {
                var r = ("mode" in s ? s : t.ajaxSettings).mode,
                    n = ("port" in s ? s : t.ajaxSettings).port;
                return "abort" === r ? (e[n] && e[n].abort(), e[n] = i.apply(this, arguments), e[n]) : i.apply(this, arguments)
            }
        }
    }(Zepto),
    function (t) {
        t.extend(t.fn, {
            validateDelegate: function (e, i, s) {
                return this.bind(i,
                    function (i) {
                        var r = t(i.target);
                        return r.is(e) ? s.apply(r, arguments) : void 0
                    })
            }
        })
    }(Zepto);

if ($.validator) {
    $.validator.setDefaults({
        focusInvalid: false,
        focusCleanup: true,
        onkeyup: false,
        autoHideMsg: true,
        ignore: '',
        errorElement: 'label',
        errorPlacement: function (error, element) {
            var errorItem = error.wrap('<span class="msgValid"></span>').append('<i></i>').parent();
            var errorLabel = errorItem.find('label');
            errorItem.insertAfter(element);
            var labelWidth = errorLabel.innerWidth() + 2,
                windowWidth = $(window).width();
            if (labelWidth + errorLabel.offset().left > windowWidth) {
                errorLabel.css('left', windowWidth - (labelWidth + errorLabel.offset().left) - 25);
            }
        }
    });

    $.extend($.validator.messages, {
        required: '选项为必填！',
        maxlength: '最长能输入{0}个字符！',
        minlength: '至少输入{0}个字符！',
        digits: '请输入正整数！'
    });

    $.validator.addMethod('ajaxvali', function (value, element, params) {
        var url = $(element).data('remote');
        var mark = false;
        $.ajax({
            url: url,
            data: value,
            type: 'GET',
            success: function (data) {
                mark = data.result
            }
        });
        return mark;
    }, '验证不通过！');

    $.validator.addMethod('eqLength', function (value, element, params) {
        return this.optional(element) || $.trim(value).length == Number(params);
    }, '请输入 {0} 位字符');

    $.validator.addMethod('dependOn', function (value, element, params) {
        var v = $.trim($(params).val());
        return v === '' || (v !== '' && $.trim(value) !== '');
    }, '请输入当前的值！');

    $.validator.addMethod('bigTo', function (value, element, params) {
        var v = Number($.trim($(params).val()));
        return this.optional(element) || Number(value) >= v;
    }, '库存量不能小于最大购买量！');

    $.validator.addMethod('smollTo', function (value, element, params) {
        var v = Number($.trim($(params).val()));
        return this.optional(element) || Number(value) <= v;
    }, '库存量不能小于最大购买量！');



    $.validator.addMethod('email', function (value, element) {
        var emailFormat = /^[a-zA-Z0-9]+([.\-_]?[a-zA-Z0-9]+)+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        return this.optional(element) || emailFormat.test($.trim(value));
    }, '请输入正确的邮箱格式！');

    $.validator.addMethod('capthca', function (value, element) {
        var capthcaFor = /^[a-zA-Z0-9]{5}$/;
        return this.optional(element) || capthcaFor.test($.trim(value));
    }, '你输入的本次验证码格式不符合规范');

    $.validator.addMethod('phone', function (value, element) {
        var regPhone = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/;
        return this.optional(element) || regPhone.test($.trim(value));
    }, '请输入一个正确的座机号，如 028-88888888');

    $.validator.addMethod('maxCodeLength', function (value, element, params) {
        var length = value.replace(/[^\x00-\xff]/g, '***').length;
        return length <= params * 3;
    }, '输入不能超出{0}个中文，请核对输入。');

    $.validator.addMethod('nickName', function (value, element) {
        var regNickName = /^[a-z0-9]+$/;
        return this.optional(element) || regNickName.test($.trim(value));
    }, '短链名以小写英文字母，数字组成！');

    $.validator.addMethod('minCodeLength', function (value, element, params) {
        var length = value.replace(/[^\x00-\xff]/g, '***').length;
        return length >= params * 3;
    }, '输入不能少于{0}个，请核对输入。');

    $.validator.addMethod('mobileOrEmail', function (value, element) {
        var regMobile = /^(1(3|4|5|8)[0-9]{9})$/,
            emailFormat = /^[a-zA-Z0-9]+([.\-_]?[a-zA-Z0-9]+)+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        return this.optional(element) || regMobile.test($.trim(value)) || emailFormat.test($.trim(value));
    }, '请输入正确的邮箱或手机号！');

    $.validator.addMethod('mobileOrPhone', function (value, element) {
        var regMobile = /^(1(3|4|5|8)[0-9]{9})$/,
            regPhone = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/;
        return this.optional(element) || regMobile.test($.trim(value)) || regPhone.test($.trim(value));
    }, '请输入正确的座机或手机号！如:028-88888888或15200000000');

    $.validator.addMethod('mobile', function (value, element) {
        var regMobile = /^(1(3|4|5|8)[0-9]{9})$/;
        return this.optional(element) || regMobile.test($.trim(value));
    }, '请输入一个正确的手机号，如 13412345678');

    $.validator.addMethod('pincode', function (value, element) {
        var pincode = /^[1-9]\d{5}$/;
        return this.optional(element) || (pincode.test(value));
    }, '请输入一个正确的邮政编码');

    $.validator.addMethod('noSpace', function (value, element) {
        return this.optional(element) || value.indexOf(' ') < 0;
    }, '请不要输入空格！');

    $.validator.addMethod('checkLen', function (value, element, params) {
        var theAttr = $(element).attr('name');
        var checkboxs = $('input[name=' + theAttr + ']:checked').length;
        return this.optional(element) || checkboxs <= params;
    }, '不能超过{0}个！');

    $.fn.smValidate = function (setting) {
        var validator;
        setting = setting || {};
        this.each(function () {
            var optRules_messages = getValidateRulesByForm($(this), setting.rules, setting.messages);
            validator = $(this).validate($.extend({
                rules: optRules_messages[0],
                messages: optRules_messages[1]
            }, setting));
        });
        return this.length > 1 ? this : validator;

        // for validate rules
        function getValidateRulesByForm(form, customRules, customeMessages) {
            // maxlength, required
            var rules = {},
                messages = {};

            form.find(':input').each(function () {
                var input = $(this),
                    key = input.attr('name') || this.id;
                if (input.attr('name') && 'reset-button-submit-radio-hidden'.indexOf(input.attr('type')) == -1) {
                    var maxLen = Number(input.attr('maxlength')),
                        minLen = Number(input.attr('minlength')),
                        required = input.attr('required'),
                        remote = input.data('remote'),
                        ruleStr = input.data('rules'),
                        messageStr = input.data('messages');

                    if (maxLen || minLen || required || remote || ruleStr) {
                        rules[key] = {};

                        if (required) rules[key].required = true;
                        if (maxLen) rules[key].maxlength = maxLen;
                        if (minLen) rules[key].minlength = minLen;
                        if (ruleStr) $.extend(rules[key], splitToObj(ruleStr));
                        if (remote) rules[key].remote = $.extend({
                            type: 'POST'
                        }, splitToObj(remote));

                        if (messageStr) {
                            var message = splitToObj(messageStr);
                            for (var ruleName in rules[key]) {
                                if (message[ruleName] || message['default']) {
                                    messages[key] = messages[key] || {};
                                    messages[key][ruleName] = message[ruleName] || message['default'];
                                }
                            }
                        }
                    }
                }
                if (customRules && typeof customRules[key] != 'undefined') {
                    rules[key] = $.extend(customRules[key], rules[key]);
                }
                if (customeMessages && typeof customeMessages[key] != 'undefined') {
                    messages[key] = $.extend(customeMessages[key], messages[key]);
                }
            });

            return [rules, messages];
        }

        function splitToObj(str) {
            var strs = str.split(','),
                retObj = {};
            if (strs.length) {
                for (var i = 0, len = strs.length; i < len; i++) {
                    var rule = $.trim(strs[i]),
                        ruleObj = rule.split(':'),
                        ruleName = $.trim(ruleObj[0]),
                        attrs = $.trim(ruleObj[1]);
                    if (attrs.indexOf('--') > 0) {
                        attrs = attrs.split('--');
                        for (var j = 0; j < attrs.length; j++) {
                            var thisAttr = attrs[j];
                            attrs[j] = isNaN(Number(thisAttr)) ? thisAttr : Number(thisAttr);
                        }
                    } else {
                        attrs = isNaN(Number(attrs)) ? attrs : Number(attrs);
                    }
                    retObj[ruleName] = attrs;
                }
            }
            return retObj;
        }
    };
    // $.validator.addMethod('require_from_group', function(value, element, options) {
    //  var $fields = $(options[1], element.form),
    //      $fieldsFirst = $fields.eq(0),
    //      validator = $fieldsFirst.data('valid_req_grp') ? $fieldsFirst.data('valid_req_grp') : $.extend({}, this),
    //      isValid = $fields.filter(function() {
    //          return validator.elementValue(this);
    //      }).length >= options[0];

    //  // Store the cloned validator for future validation
    //  $fieldsFirst.data('valid_req_grp', validator);

    //  // If element isn't being validated, run each require_from_group field's validation rules
    //  if (!$(element).data('being_validated')) {
    //      $fields.data('being_validated', true);
    //      $fields.each(function() {
    //          validator.element(this);
    //      });
    //      $fields.data('being_validated', false);
    //  }
    //  return isValid;
    // }, $.validator.format(_e('valid_least_item')));
}